<?php

declare(strict_types=1);

namespace Nowo\SelectAllChoiceBundle\Form\Extension;

use Symfony\Component\Form\AbstractTypeExtension;
use Symfony\Component\Form\Extension\Core\Type\ChoiceType;
use Symfony\Component\Form\FormBuilderInterface;
use Symfony\Component\Form\FormEvent;
use Symfony\Component\Form\FormEvents;
use Symfony\Component\Form\FormInterface;
use Symfony\Component\Form\FormView;
use Symfony\Component\OptionsResolver\OptionsResolver;

use function is_array;

/**
 * Form type extension that adds optional "Select all" support to ChoiceType when multiple=true.
 *
 * When the field option select_all is true, the Twig theme wraps the widget and passes config
 * via data attributes; the Stimulus controller creates and manages the toggle in the DOM.
 */
final class ChoiceTypeSelectAllExtension extends AbstractTypeExtension
{
    /**
     * @param string $defaultLabel Default translation key for the toggle label
     * @param string $defaultPosition Default position: "before" or "after"
     * @param string $defaultToggleCssClass Default CSS class for the toggle input
     * @param string $defaultWrapperCssClass Default CSS class for the wrapper (toggle + label)
     * @param string $defaultLabelCssClass Default CSS class for the toggle label
     * @param string $defaultContainerCssClass Default CSS class for the outer wrapper
     * @param string $translationDomain Default translation domain for the label
     * @param bool $debug When true, frontend shows all console logs; when false, only "script loaded"
     */
    public function __construct(
        private readonly string $defaultLabel,
        private readonly string $defaultPosition,
        private readonly string $defaultToggleCssClass,
        private readonly string $defaultWrapperCssClass,
        private readonly string $defaultLabelCssClass,
        private readonly string $defaultContainerCssClass,
        private readonly string $translationDomain,
        private readonly bool $debug = false,
    ) {
    }

    /**
     * Returns the form types extended by this extension.
     *
     * @return iterable<int, class-string<ChoiceType>>
     */
    public static function getExtendedTypes(): iterable
    {
        return [ChoiceType::class];
    }

    /**
     * Normalizes submitted data for multi-select choices before ChoiceType processes it.
     * Removes null entries so that internal array_flip calls only see scalar values.
     *
     * @param FormBuilderInterface<mixed> $builder The form builder for the field
     * @param array<string, mixed> $options The resolved options
     */
    public function buildForm(FormBuilderInterface $builder, array $options): void
    {
        if (!$options['multiple']) {
            return;
        }

        // Clean up nulls from multi-select collections before ChoiceType processes the data
        $builder->addEventListener(FormEvents::PRE_SUBMIT, static function (FormEvent $event): void {
            $data = $event->getData();
            if (!is_array($data)) {
                return;
            }

            // Remove null entries to avoid array_flip warnings in ChoiceType
            $data = array_values(array_filter(
                $data,
                static fn ($value): bool => $value !== null,
            ));

            $event->setData($data);
        });
    }

    /**
     * Defines the form options for the "Select all" feature.
     *
     * @param OptionsResolver $resolver The options resolver
     */
    public function configureOptions(OptionsResolver $resolver): void
    {
        $resolver->setDefaults([
            'select_all'                     => false,
            'select_all_label'               => null,
            'select_all_position'            => $this->defaultPosition,
            'select_all_css_class'           => $this->defaultToggleCssClass,
            'select_all_wrapper_css_class'   => $this->defaultWrapperCssClass,
            'select_all_label_css_class'     => $this->defaultLabelCssClass,
            'select_all_container_css_class' => $this->defaultContainerCssClass,
            'select_all_translation_domain'  => null,
        ]);

        $resolver->setAllowedTypes('select_all', 'bool');
        $resolver->setAllowedTypes('select_all_label', ['null', 'string']);
        $resolver->setAllowedValues('select_all_position', ['before', 'after']);
        $resolver->setAllowedTypes('select_all_css_class', 'string');
        $resolver->setAllowedTypes('select_all_wrapper_css_class', 'string');
        $resolver->setAllowedTypes('select_all_label_css_class', 'string');
        $resolver->setAllowedTypes('select_all_container_css_class', 'string');
        $resolver->setAllowedTypes('select_all_translation_domain', ['null', 'string']);
    }

    /**
     * Passes "Select all" options to the view for the Twig theme and Stimulus controller.
     *
     * @param FormView $view The form view
     * @param FormInterface<mixed> $form The form
     * @param array<string, mixed> $options The resolved options
     */
    public function buildView(FormView $view, FormInterface $form, array $options): void
    {
        if (!$options['multiple']) {
            return;
        }

        $view->vars['select_all_enabled'] = $options['select_all'];
        if (!$options['select_all']) {
            return;
        }

        $view->vars['select_all_label']               = $options['select_all_label'] ?? $this->defaultLabel;
        $view->vars['select_all_position']            = $options['select_all_position'];
        $view->vars['select_all_css_class']           = $options['select_all_css_class'];
        $view->vars['select_all_wrapper_css_class']   = $options['select_all_wrapper_css_class'];
        $view->vars['select_all_label_css_class']     = $options['select_all_label_css_class'];
        $view->vars['select_all_container_css_class'] = $options['select_all_container_css_class'];
        $view->vars['select_all_translation_domain']  = $options['select_all_translation_domain'] ?? $this->translationDomain;
        $view->vars['select_all_debug']               = $this->debug;
    }
}
