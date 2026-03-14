<?php

declare(strict_types=1);

namespace Nowo\SelectAllChoiceBundle\Tests\Unit\Form\Extension;

use Nowo\SelectAllChoiceBundle\Form\Extension\ChoiceTypeSelectAllExtension;
use PHPUnit\Framework\TestCase;
use Symfony\Component\Form\Extension\Core\Type\ChoiceType;
use Symfony\Component\Form\FormBuilderInterface;
use Symfony\Component\Form\FormEvent;
use Symfony\Component\Form\FormEvents;
use Symfony\Component\Form\FormInterface;
use Symfony\Component\Form\FormView;
use Symfony\Component\OptionsResolver\OptionsResolver;

final class ChoiceTypeSelectAllExtensionTest extends TestCase
{
    private ChoiceTypeSelectAllExtension $extension;

    protected function setUp(): void
    {
        $this->extension = new ChoiceTypeSelectAllExtension(
            'form.select_all',
            'before',
            'form-check-input',
            'form-check',
            'form-check-label',
            'form-check mb-2',
            'nowo_select_all_choice',
        );
    }

    public function testExtendedTypeIsChoiceType(): void
    {
        $types = ChoiceTypeSelectAllExtension::getExtendedTypes();
        self::assertContains(ChoiceType::class, $types);
    }

    public function testConfigureOptionsSetsDefaults(): void
    {
        $resolver = new OptionsResolver();
        $this->extension->configureOptions($resolver);

        $resolved = $resolver->resolve([]);

        self::assertFalse($resolved['select_all']);
        self::assertNull($resolved['select_all_label']);
        self::assertSame('before', $resolved['select_all_position']);
        self::assertSame('form-check-input', $resolved['select_all_css_class']);
        self::assertSame('form-check', $resolved['select_all_wrapper_css_class']);
        self::assertSame('form-check-label', $resolved['select_all_label_css_class']);
        self::assertSame('form-check mb-2', $resolved['select_all_container_css_class']);
        self::assertNull($resolved['select_all_translation_domain']);
    }

    public function testConfigureOptionsResolvesCustomOptions(): void
    {
        $resolver = new OptionsResolver();
        $this->extension->configureOptions($resolver);

        $resolved = $resolver->resolve([
            'select_all'                     => true,
            'select_all_label'               => 'custom.label',
            'select_all_position'            => 'after',
            'select_all_css_class'           => 'custom-input',
            'select_all_wrapper_css_class'   => 'custom-wrapper',
            'select_all_label_css_class'     => 'custom-label',
            'select_all_container_css_class' => 'custom-wrap',
            'select_all_translation_domain'  => 'messages',
        ]);

        self::assertTrue($resolved['select_all']);
        self::assertSame('custom.label', $resolved['select_all_label']);
        self::assertSame('after', $resolved['select_all_position']);
        self::assertSame('custom-input', $resolved['select_all_css_class']);
        self::assertSame('custom-wrapper', $resolved['select_all_wrapper_css_class']);
        self::assertSame('custom-label', $resolved['select_all_label_css_class']);
        self::assertSame('custom-wrap', $resolved['select_all_container_css_class']);
        self::assertSame('messages', $resolved['select_all_translation_domain']);
    }

    public function testConfigureOptionsRejectsInvalidPosition(): void
    {
        $resolver = new OptionsResolver();
        $this->extension->configureOptions($resolver);

        $this->expectException(\Symfony\Component\OptionsResolver\Exception\InvalidOptionsException::class);

        $resolver->resolve(['select_all_position' => 'invalid']);
    }

    public function testBuildViewAddsSelectAllVarsWhenMultipleAndSelectAllEnabled(): void
    {
        $view = new FormView();
        $form = $this->createMock(FormInterface::class);

        $this->extension->buildView($view, $form, [
            'multiple'                       => true,
            'select_all'                     => true,
            'select_all_label'               => null,
            'select_all_position'            => 'after',
            'select_all_css_class'           => 'form-check-input',
            'select_all_wrapper_css_class'   => 'form-check',
            'select_all_label_css_class'     => 'form-check-label',
            'select_all_container_css_class' => 'form-check mb-2',
            'select_all_translation_domain'  => null,
        ]);

        self::assertTrue($view->vars['select_all_enabled']);
        self::assertSame('form.select_all', $view->vars['select_all_label']);
        self::assertSame('after', $view->vars['select_all_position']);
        self::assertSame('form-check-input', $view->vars['select_all_css_class']);
        self::assertSame('form-check', $view->vars['select_all_wrapper_css_class']);
        self::assertSame('form-check-label', $view->vars['select_all_label_css_class']);
        self::assertSame('form-check mb-2', $view->vars['select_all_container_css_class']);
        self::assertSame('nowo_select_all_choice', $view->vars['select_all_translation_domain']);
    }

    public function testBuildViewDoesNotAddSelectAllWhenMultipleFalse(): void
    {
        $view = new FormView();
        $form = $this->createMock(FormInterface::class);

        $this->extension->buildView($view, $form, [
            'multiple'   => false,
            'select_all' => true,
        ]);

        self::assertArrayNotHasKey('select_all_enabled', $view->vars);
    }

    public function testBuildViewDoesNotAddSelectAllWhenSelectAllDisabled(): void
    {
        $view = new FormView();
        $form = $this->createMock(FormInterface::class);

        $this->extension->buildView($view, $form, [
            'multiple'   => true,
            'select_all' => false,
        ]);

        self::assertFalse($view->vars['select_all_enabled']);
    }

    public function testBuildViewUsesCustomLabelWhenProvided(): void
    {
        $view = new FormView();
        $form = $this->createMock(FormInterface::class);

        $this->extension->buildView($view, $form, [
            'multiple'                       => true,
            'select_all'                     => true,
            'select_all_label'               => 'my.custom_label',
            'select_all_position'            => 'before',
            'select_all_css_class'           => 'form-check-input',
            'select_all_wrapper_css_class'   => 'form-check',
            'select_all_label_css_class'     => 'form-check-label',
            'select_all_container_css_class' => 'form-check mb-2',
            'select_all_translation_domain'  => 'messages',
        ]);

        self::assertSame('my.custom_label', $view->vars['select_all_label']);
        self::assertSame('messages', $view->vars['select_all_translation_domain']);
    }

    public function testBuildViewIncludesDebugWhenConstructorHasDebugTrue(): void
    {
        $extension = new ChoiceTypeSelectAllExtension(
            'form.select_all',
            'before',
            'form-check-input',
            'form-check',
            'form-check-label',
            'form-check mb-2',
            'nowo_select_all_choice',
            true,
        );
        $view = new FormView();
        $form = $this->createMock(FormInterface::class);

        $extension->buildView($view, $form, [
            'multiple'                       => true,
            'select_all'                     => true,
            'select_all_label'               => null,
            'select_all_position'            => 'before',
            'select_all_css_class'           => 'form-check-input',
            'select_all_wrapper_css_class'   => 'form-check',
            'select_all_label_css_class'     => 'form-check-label',
            'select_all_container_css_class' => 'form-check mb-2',
            'select_all_translation_domain'  => null,
        ]);

        self::assertTrue($view->vars['select_all_debug']);
    }

    public function testBuildFormDoesNothingWhenMultipleFalse(): void
    {
        $builder = $this->createMock(FormBuilderInterface::class);
        $builder->expects(self::never())->method('addEventListener');

        $this->extension->buildForm($builder, ['multiple' => false]);
    }

    public function testBuildFormAddsPreSubmitListenerWhenMultipleTrue(): void
    {
        $listener = null;
        $builder  = $this->createMock(FormBuilderInterface::class);
        $builder->expects(self::once())
            ->method('addEventListener')
            ->with(self::identicalTo(FormEvents::PRE_SUBMIT), self::callback(static function (callable $cb) use (&$listener): bool {
                $listener = $cb;

                return true;
            }));

        $this->extension->buildForm($builder, ['multiple' => true]);
        self::assertIsCallable($listener);
    }

    public function testBuildFormListenerFiltersNullFromSubmittedData(): void
    {
        $listener = null;
        $builder  = $this->createMock(FormBuilderInterface::class);
        $builder->method('addEventListener')->willReturnCallback(
            static function (string $event, callable $cb) use (&$listener, $builder) {
                $listener = $cb;

                return $builder;
            },
        );
        $this->extension->buildForm($builder, ['multiple' => true]);

        self::assertNotNull($listener);
        $event = new FormEvent($this->createMock(FormInterface::class), [1, null, 'a', null, 2]);
        $listener($event);

        self::assertSame([1, 'a', 2], $event->getData());
    }

    public function testBuildFormListenerLeavesNonArrayDataUnchanged(): void
    {
        $listener = null;
        $builder  = $this->createMock(FormBuilderInterface::class);
        $builder->method('addEventListener')->willReturnCallback(
            static function (string $event, callable $cb) use (&$listener, $builder) {
                $listener = $cb;

                return $builder;
            },
        );
        $this->extension->buildForm($builder, ['multiple' => true]);

        self::assertNotNull($listener);
        $event = new FormEvent($this->createMock(FormInterface::class), 'not-an-array');
        $listener($event);

        self::assertSame('not-an-array', $event->getData());
    }
}
