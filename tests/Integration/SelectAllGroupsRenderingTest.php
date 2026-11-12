<?php

declare(strict_types=1);

namespace Nowo\SelectAllChoiceBundle\Tests\Integration;

use DOMDocument;
use DOMElement;
use DOMXPath;
use Nowo\SelectAllChoiceBundle\DependencyInjection\Configuration;
use Nowo\SelectAllChoiceBundle\Form\Extension\ChoiceTypeSelectAllExtension;
use PHPUnit\Framework\Attributes\DataProvider;
use PHPUnit\Framework\TestCase;
use ReflectionClass;
use Symfony\Bridge\Twig\AppVariable;
use Symfony\Bridge\Twig\Extension\FormExtension;
use Symfony\Bridge\Twig\Extension\TranslationExtension;
use Symfony\Bridge\Twig\Form\TwigRendererEngine;
use Symfony\Component\Form\Extension\Core\Type\ChoiceType;
use Symfony\Component\Form\Extension\Core\Type\FormType;
use Symfony\Component\Form\FormFactoryInterface;
use Symfony\Component\Form\FormInterface;
use Symfony\Component\Form\FormRenderer;
use Symfony\Component\Form\Forms;
use Symfony\Component\Form\FormView;
use Symfony\Component\Translation\Loader\YamlFileLoader;
use Symfony\Component\Translation\Translator;
use Twig\Environment;
use Twig\Loader\FilesystemLoader;
use Twig\RuntimeLoader\FactoryRuntimeLoader;

use function array_keys;
use function array_map;
use function dirname;
use function explode;
use function implode;
use function iterator_to_array;
use function libxml_use_internal_errors;
use function parse_str;
use function sort;
use function substr_count;
use function trim;

/**
 * Renders real ChoiceType fields through the bundle form themes (Twig + Symfony form renderer) and submits the
 * rendered checkboxes back, as a browser would, to prove the group boxes never reach the request data.
 */
final class SelectAllGroupsRenderingTest extends TestCase
{
    private const CHOICES = [
        'Incidents' => [
            'New issue'  => 'issue.new',
            'Regression' => 'issue.regression',
        ],
        'Availability' => [
            'Monitor down' => 'monitor.down',
            'Monitor up'   => 'monitor.up',
        ],
        'Tasks' => [
            'Task failed' => 'task.failed',
        ],
    ];

    private const ALL_VALUES = ['issue.new', 'issue.regression', 'monitor.down', 'monitor.up', 'task.failed'];

    private const CHILD_LABELS = ['New issue', 'Regression', 'Monitor down', 'Monitor up', 'Task failed'];

    /**
     * @return iterable<string, array{string}>
     */
    public static function themes(): iterable
    {
        foreach (array_keys(Configuration::FORM_THEME_MAP) as $base) {
            yield $base => [$base];
        }
    }

    #[DataProvider('themes')]
    public function testEveryThemeRendersOneFieldsetPerGroupWithAnUnnamedBox(string $base): void
    {
        $form = $this->notificationForm(['select_all' => true], ['issue.new', 'issue.regression', 'monitor.down']);
        $xp   = $this->xpath($this->render($form, $base));

        $groups = $xp->query('//fieldset[@data-select-all-target="group"]');
        self::assertNotFalse($groups);
        self::assertSame(3, $groups->length);
        self::assertSame(['Incidents', 'Availability', 'Tasks'], $this->texts($xp, '//fieldset/legend'));

        // Group boxes: no name (never submitted), a label naming the group, aria-controls pointing to the children.
        $toggles = $this->elements($xp, '//input[@data-select-all-target="groupToggle"]');
        self::assertCount(3, $toggles);
        foreach ($toggles as $toggle) {
            self::assertFalse($toggle->hasAttribute('name'));
            self::assertFalse($toggle->hasAttribute('form'));
            self::assertSame('checkbox', $toggle->getAttribute('type'));
            foreach (explode(' ', $toggle->getAttribute('aria-controls')) as $id) {
                $child = $this->elements($xp, '//input[@id="' . $id . '"]');
                self::assertCount(1, $child, 'aria-controls points to a rendered child: ' . $id);
                self::assertSame('form[targets][]', $child[0]->getAttribute('name'));
            }
        }
        self::assertSame(
            ['Select all in Incidents', 'Select all in Availability', 'Select all in Tasks'],
            $this->texts($xp, '//label[@for and contains(@class, "nowo-select-all-choice__group-toggle-label")]'),
        );

        // Load state: Incidents all checked, Availability partial (mixed), Tasks empty.
        self::assertSame(['true', 'mixed', 'false'], array_map(static fn (DOMElement $t): string => $t->getAttribute('aria-checked'), $toggles));
        self::assertSame([true, false, false], array_map(static fn (DOMElement $t): bool => $t->hasAttribute('checked'), $toggles));

        // Every child is rendered exactly once, with its label.
        self::assertCount(5, $this->elements($xp, '//input[@name="form[targets][]"]'));
        $html = $this->render($form, $base);
        foreach (self::CHILD_LABELS as $label) {
            self::assertSame(1, substr_count($html, $label), $base . ': one label for ' . $label);
        }

        // The wrapper tells the controller about the groups and the global box.
        $host = $this->elements($xp, '//nowo-select-all-choice')[0];
        self::assertSame('true', $host->getAttribute('data-select-all-groups-value'));
        self::assertSame('true', $host->getAttribute('data-select-all-global-value'));
    }

    /**
     * Without select_all_groups every theme keeps the 1.6 markup (Foundation themes used to fail to compile).
     */
    #[DataProvider('themes')]
    public function testEveryThemeStillRendersTheGlobalWrapperWithoutGroups(string $base): void
    {
        foreach ([true, false] as $expanded) {
            $form = $this->notificationForm(['select_all' => true, 'select_all_groups' => false, 'expanded' => $expanded]);
            $html = $this->render($form, $base);
            $xp   = $this->xpath($html);

            self::assertCount(1, $this->elements($xp, '//nowo-select-all-choice[@data-select-all-expanded-value="' . ($expanded ? 'true' : 'false') . '"]'));
            self::assertStringNotContainsString('<fieldset', $html);
            self::assertStringNotContainsString('data-select-all-groups-value', $html);
        }
    }

    public function testCssHooksAndHostClassesAreRendered(): void
    {
        $form = $this->notificationForm([
            'select_all_groups_attr'        => ['class' => 'grid md:grid-cols-3 gap-4', 'data-testid' => 'groups'],
            'select_all_group_attr'         => static fn (string $label, int $index): array => ['class' => 'card', 'data-testid' => 'group-' . $index . '-' . $label],
            'select_all_group_legend_attr'  => ['class' => 'card-title'],
            'select_all_group_toggle_attr'  => ['class' => 'toggle-xl', 'name' => 'hijack', 'data-testid' => 'toggle'],
            'select_all_group_choices_attr' => ['class' => 'card-body'],
            'select_all_group_choice_attr'  => ['class' => 'choice-row'],
            'attr'                          => ['class' => 'host-field'],
        ]);
        $xp = $this->xpath($this->render($form, 'form_div_layout.html.twig'));

        $groups = $this->elements($xp, '//div[@data-testid="groups"]');
        self::assertCount(1, $groups);
        self::assertSame('nowo-select-all-choice__groups grid md:grid-cols-3 gap-4 host-field', $groups[0]->getAttribute('class'));
        self::assertSame('form_targets', $groups[0]->getAttribute('id'));

        $fieldsets = $this->elements($xp, '//fieldset');
        self::assertSame('nowo-select-all-choice__group card', $fieldsets[0]->getAttribute('class'));
        self::assertSame('group-2-Tasks', $fieldsets[2]->getAttribute('data-testid'));
        self::assertSame('nowo-select-all-choice__group-legend card-title', $this->elements($xp, '//legend')[0]->getAttribute('class'));

        $toggle = $this->elements($xp, '//input[@data-select-all-target="groupToggle"]')[0];
        self::assertSame('nowo-select-all-choice__group-toggle-input form-check-input toggle-xl', $toggle->getAttribute('class'));
        self::assertSame('toggle', $toggle->getAttribute('data-testid'));
        self::assertFalse($toggle->hasAttribute('name'), 'a host cannot give the group box a name');
        self::assertSame('nowo-select-all-choice__group-toggle form-check', $this->parent($toggle)->getAttribute('class'));

        self::assertCount(3, $this->elements($xp, '//div[@data-select-all-target="groupChoices" and @class="nowo-select-all-choice__group-choices card-body"]'));
        self::assertCount(5, $this->elements($xp, '//div[@class="nowo-select-all-choice__choice choice-row"]'));

        // No global box requested: the controller is told not to create it.
        self::assertSame('false', $this->elements($xp, '//nowo-select-all-choice')[0]->getAttribute('data-select-all-global-value'));
    }

    public function testGroupsFromAChoiceAttrDataKeyKeepUngroupedChoicesInOrder(): void
    {
        $factory = $this->factory();
        $form    = $factory->createNamedBuilder('form', FormType::class)
            ->add('targets', ChoiceType::class, [
                'choices'     => ['Digest' => 'digest', 'New issue' => 'issue.new', 'Monitor down' => 'monitor.down', 'Regression' => 'issue.regression'],
                'choice_attr' => static fn (string $value): array => match ($value) {
                    'digest'       => [],
                    'monitor.down' => ['data-group' => 'Availability'],
                    default        => ['data-group' => 'Incidents'],
                },
                'multiple'             => true,
                'expanded'             => true,
                'select_all_groups'    => true,
                'select_all_group_key' => 'data-group',
            ])
            ->getForm();
        $xp = $this->xpath($this->render($form, 'bootstrap_5_layout.html.twig'));

        self::assertSame(['Incidents', 'Availability'], $this->texts($xp, '//fieldset/legend'));
        self::assertCount(1, $this->elements($xp, '//div[contains(@class, "nowo-select-all-choice__ungrouped")]//input[@value="digest"]'));
        self::assertCount(2, $this->elements($xp, '//fieldset[1]//input[@name="form[targets][]"]'));
    }

    public function testPreferredChoicesStayInTheirGroup(): void
    {
        $form = $this->notificationForm(['preferred_choices' => ['issue.new', 'task.failed'], 'duplicate_preferred_choices' => false]);
        $xp   = $this->xpath($this->render($form, 'form_div_layout.html.twig'));

        self::assertSame(['Incidents', 'Availability', 'Tasks'], $this->texts($xp, '//fieldset/legend'));
        self::assertCount(2, $this->elements($xp, '//fieldset[1]//input[@name="form[targets][]"]'));
        self::assertCount(1, $this->elements($xp, '//fieldset[3]//input[@value="task.failed"]'));
        self::assertCount(0, $this->elements($xp, '//div[contains(@class, "nowo-select-all-choice__ungrouped")]'));
        self::assertCount(5, $this->elements($xp, '//input[@name="form[targets][]"]'));
    }

    public function testTheGroupLabelIsTranslated(): void
    {
        $form = $this->notificationForm(['select_all' => true]);
        $xp   = $this->xpath($this->render($form, 'form_div_layout.html.twig', 'es'));

        self::assertSame('Seleccionar todo en Incidents', $this->texts($xp, '//label[contains(@class, "group-toggle-label")]')[0]);
    }

    public function testAllChildrenDisabledDisablesTheGroupBox(): void
    {
        $form = $this->notificationForm(['disabled' => true]);
        $xp   = $this->xpath($this->render($form, 'form_div_layout.html.twig'));

        foreach ($this->elements($xp, '//input[@data-select-all-target="groupToggle"]') as $toggle) {
            self::assertTrue($toggle->hasAttribute('disabled'));
        }
    }

    public function testDefaultsRenderNoGroupMarkup(): void
    {
        $html = $this->render($this->notificationForm(['select_all' => true, 'select_all_groups' => false]), 'form_div_layout.html.twig');

        self::assertStringNotContainsString('<fieldset', $html);
        self::assertStringNotContainsString('data-select-all-groups-value', $html);
        self::assertStringNotContainsString('data-select-all-global-value', $html);
        self::assertStringContainsString('data-select-all-label-class-value="form-check-label">', $html);
    }

    public function testCollapsedChoicesIgnoreTheGroupsOption(): void
    {
        $html = $this->render($this->notificationForm(['expanded' => false]), 'form_div_layout.html.twig');

        self::assertStringNotContainsString('<fieldset', $html);
        self::assertStringNotContainsString('nowo-select-all-choice', $html);
        self::assertStringContainsString('<optgroup label="Incidents">', $html);
    }

    /**
     * A browser submits every named, checked checkbox. Ticking every box on the page (group boxes and the global box
     * included) must submit the children only: the boxes add nothing to the request data and nothing to validate.
     */
    public function testSubmittedDataEqualsTheChildrenOnly(): void
    {
        $form = $this->notificationForm(['select_all' => true]);
        $xp   = $this->xpath($this->render($form, 'bootstrap_5_layout.html.twig'));

        $pairs = [];
        foreach ($this->elements($xp, '//input[@type="checkbox"]') as $checkbox) {
            // Ticking every box; only those with a name end up in the request, exactly as in a browser.
            if ($checkbox->hasAttribute('name')) {
                $pairs[] = $checkbox->getAttribute('name') . '=' . $checkbox->getAttribute('value');
            }
        }
        parse_str(implode('&', $pairs), $request);
        self::assertSame(['form'], array_keys($request));
        self::assertIsArray($request['form']);
        self::assertSame(['targets'], array_keys($request['form']));

        $submitted = $this->notificationForm(['select_all' => true]);
        $submitted->submit($request['form']);

        self::assertTrue($submitted->isSynchronized());
        self::assertTrue($submitted->isValid());
        self::assertSame([], $submitted->getExtraData());
        $data = $submitted->get('targets')->getData();
        self::assertIsArray($data);
        sort($data);
        $expected = self::ALL_VALUES;
        sort($expected);
        self::assertSame($expected, $data);
    }

    /**
     * After a failed submit the form is rendered again from the submitted data: the group boxes reflect that data,
     * not the initial one.
     */
    public function testReRenderAfterSubmitReflectsTheSubmittedChildren(): void
    {
        $form = $this->notificationForm(['select_all' => true], ['issue.new', 'issue.regression']);
        $form->submit(['targets' => ['monitor.down', 'monitor.up', 'issue.new']]);

        $xp      = $this->xpath($this->render($form, 'form_div_layout.html.twig'));
        $toggles = $this->elements($xp, '//input[@data-select-all-target="groupToggle"]');

        self::assertSame(['mixed', 'true', 'false'], array_map(static fn (DOMElement $t): string => $t->getAttribute('aria-checked'), $toggles));
        self::assertSame(['issue.new', 'monitor.down', 'monitor.up'], array_map(
            static fn (DOMElement $i): string => $i->getAttribute('value'),
            $this->elements($xp, '//input[@name="form[targets][]" and @checked]'),
        ));
    }

    /**
     * @param array<string, mixed> $options
     * @param list<string> $data
     *
     * @return FormInterface<mixed>
     */
    private function notificationForm(array $options = [], array $data = []): FormInterface
    {
        return $this->factory()->createNamedBuilder('form', FormType::class, ['targets' => $data])
            ->add('targets', ChoiceType::class, $options + [
                'choices'           => self::CHOICES,
                'multiple'          => true,
                'expanded'          => true,
                'select_all_groups' => true,
            ])
            ->getForm();
    }

    private function factory(): FormFactoryInterface
    {
        return Forms::createFormFactoryBuilder()
            ->addTypeExtension(new ChoiceTypeSelectAllExtension(
                'form.select_all',
                'before',
                'form-check-input',
                'form-check',
                'form-check-label',
                'form-check mb-2',
                'NowoSelectAllChoiceBundle',
            ))
            ->getFormFactory();
    }

    /**
     * @param FormInterface<mixed> $form
     */
    private function render(FormInterface $form, string $base, string $locale = 'en'): string
    {
        $bridgeViews = dirname((string) (new ReflectionClass(AppVariable::class))->getFileName()) . '/Resources/views/Form';
        $loader      = new FilesystemLoader([$bridgeViews]);
        $loader->addPath(dirname(__DIR__, 2) . '/src/Resources/views', 'NowoSelectAllChoiceBundle');
        $twig = new Environment($loader, ['strict_variables' => true, 'cache' => false]);

        $translator = new Translator($locale);
        $translator->addLoader('yaml', new YamlFileLoader());
        foreach (['en', 'es'] as $catalogue) {
            $translator->addResource(
                'yaml',
                dirname(__DIR__, 2) . '/src/Resources/translations/NowoSelectAllChoiceBundle.' . $catalogue . '.yaml',
                $catalogue,
                'NowoSelectAllChoiceBundle',
            );
        }
        $twig->addExtension(new TranslationExtension($translator));
        $twig->addExtension(new FormExtension());

        $engine = new TwigRendererEngine([Configuration::FORM_THEME_MAP[$base]], $twig);
        $twig->addRuntimeLoader(new FactoryRuntimeLoader([
            FormRenderer::class => static fn (): FormRenderer => new FormRenderer($engine),
        ]));

        $view = $form->createView();
        self::assertInstanceOf(FormView::class, $view['targets']);

        return $twig->createTemplate('{{ form_widget(form.targets) }}')->render(['form' => $view]);
    }

    private function xpath(string $html): DOMXPath
    {
        $doc      = new DOMDocument();
        $previous = libxml_use_internal_errors(true);
        $doc->loadHTML('<!doctype html><html><body>' . $html . '</body></html>');
        libxml_use_internal_errors($previous);

        return new DOMXPath($doc);
    }

    /**
     * @return list<DOMElement>
     */
    private function elements(DOMXPath $xp, string $query): array
    {
        $nodes = $xp->query($query);
        self::assertNotFalse($nodes);

        $elements = [];
        foreach (iterator_to_array($nodes) as $node) {
            self::assertInstanceOf(DOMElement::class, $node);
            $elements[] = $node;
        }

        return $elements;
    }

    /**
     * @return list<string>
     */
    private function texts(DOMXPath $xp, string $query): array
    {
        return array_map(static fn (DOMElement $e): string => trim($e->textContent), $this->elements($xp, $query));
    }

    private function parent(DOMElement $element): DOMElement
    {
        $parent = $element->parentNode;
        self::assertInstanceOf(DOMElement::class, $parent);

        return $parent;
    }
}
