<?php

declare(strict_types=1);

namespace Nowo\SelectAllChoiceBundle\Tests\Integration\Worker;

use Nowo\SelectAllChoiceBundle\DependencyInjection\Configuration;
use Nowo\SelectAllChoiceBundle\Form\Extension\ChoiceTypeSelectAllExtension;
use PHPUnit\Framework\TestCase;
use ReflectionClass;
use Symfony\Bridge\Twig\AppVariable;
use Symfony\Bridge\Twig\Extension\FormExtension;
use Symfony\Bridge\Twig\Extension\TranslationExtension;
use Symfony\Bridge\Twig\Form\TwigRendererEngine;
use Symfony\Component\Form\Extension\Core\Type\ChoiceType;
use Symfony\Component\Form\Extension\Core\Type\FormType;
use Symfony\Component\Form\FormRenderer;
use Symfony\Component\Form\Forms;
use Symfony\Component\Translation\Loader\YamlFileLoader;
use Symfony\Component\Translation\Translator;
use Twig\Environment;
use Twig\Loader\FilesystemLoader;
use Twig\RuntimeLoader\FactoryRuntimeLoader;

use function dirname;
use function gc_collect_cycles;
use function memory_get_usage;
use function sprintf;

/**
 * REQ-RUNTIME-002: the form type extension, the Twig environment, the form renderer and the translator are built
 * once and kept, as a FrankenPHP worker with kernel reset false keeps them; nothing is reset. N host forms are
 * rendered and submitted alternating two inputs (two choice sets, two locales); each render must contain only its own
 * choices and labels, and memory must stay flat.
 */
final class WorkerKeptAliveTest extends TestCase
{
    private const ITERATIONS = 1200;
    private const WARM_UP    = 100;
    private const MARGIN     = 4 * 1024 * 1024;

    public function testAlternatingInputsAndLocalesLeakNothingAndKeepMemoryFlat(): void
    {
        $factory = Forms::createFormFactoryBuilder()
            ->addTypeExtension(new ChoiceTypeSelectAllExtension('form.select_all', 'before', 'form-check-input', 'form-check', 'form-check-label', 'form-check mb-2', 'NowoSelectAllChoiceBundle'))
            ->getFormFactory();

        $bridgeViews = dirname((string) (new ReflectionClass(AppVariable::class))->getFileName()) . '/Resources/views/Form';
        $loader      = new FilesystemLoader([$bridgeViews]);
        $loader->addPath(dirname(__DIR__, 3) . '/src/Resources/views', 'NowoSelectAllChoiceBundle');
        $twig       = new Environment($loader, ['strict_variables' => true, 'cache' => false]);
        $translator = new Translator('en');
        $translator->addLoader('yaml', new YamlFileLoader());
        foreach (['en', 'es'] as $catalogue) {
            $translator->addResource('yaml', dirname(__DIR__, 3) . '/src/Resources/translations/NowoSelectAllChoiceBundle.' . $catalogue . '.yaml', $catalogue, 'NowoSelectAllChoiceBundle');
        }
        $twig->addExtension(new TranslationExtension($translator));
        $twig->addExtension(new FormExtension());
        $engine = new TwigRendererEngine([Configuration::FORM_THEME_MAP['form_div_layout.html.twig']], $twig);
        $twig->addRuntimeLoader(new FactoryRuntimeLoader([FormRenderer::class => static fn (): FormRenderer => new FormRenderer($engine)]));

        $inputs = [
            'alpha' => ['locale' => 'en', 'choices' => ['Alpha group' => ['Alpha one' => 'a1', 'Alpha two' => 'a2']], 'submit' => ['a1'], 'label' => 'Select all', 'otherLabel' => 'Seleccionar todo', 'other' => 'Beta'],
            'beta'  => ['locale' => 'es', 'choices' => ['Beta group' => ['Beta one' => 'b1', 'Beta two' => 'b2']], 'submit' => ['b1', 'b2'], 'label' => 'Seleccionar todo', 'otherLabel' => 'Select all', 'other' => 'Alpha'],
        ];

        $baseline = 0;
        for ($i = 0; $i < self::ITERATIONS; ++$i) {
            if ($i === self::WARM_UP) {
                gc_collect_cycles();
                $baseline = memory_get_usage();
            }

            $who  = $i % 2 === 0 ? 'alpha' : 'beta';
            $data = $inputs[$who];
            $translator->setLocale($data['locale']);

            $form = $factory->createNamedBuilder('form', FormType::class)
                ->add('targets', ChoiceType::class, ['choices' => $data['choices'], 'multiple' => true, 'expanded' => true, 'select_all' => true, 'select_all_groups' => true])
                ->getForm();
            $form->submit(['targets' => $data['submit']]);
            self::assertTrue($form->isSynchronized(), sprintf('iteration %d', $i));
            self::assertSame($data['submit'], $form->get('targets')->getData(), sprintf('iteration %d', $i));

            $html = $twig->createTemplate('{{ form_widget(form.targets) }}')->render(['form' => $form->createView()]);
            self::assertStringContainsString($data['label'], $html, sprintf('iteration %d', $i));
            self::assertStringContainsString($data['other'] === 'Beta' ? 'Alpha group' : 'Beta group', $html, sprintf('iteration %d', $i));
            self::assertStringNotContainsString($data['otherLabel'], $html, sprintf('iteration %d leaked the other locale', $i));
            self::assertStringNotContainsString($data['other'], $html, sprintf('iteration %d leaked the other input', $i));
        }

        gc_collect_cycles();
        $growth = memory_get_usage() - $baseline;
        self::assertLessThan(self::MARGIN, $growth, sprintf('memory grew by %d bytes over %d iterations', $growth, self::ITERATIONS - self::WARM_UP));
    }
}
