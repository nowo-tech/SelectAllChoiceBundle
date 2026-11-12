<?php

declare(strict_types=1);

namespace Nowo\SelectAllChoiceBundle\Form\Extension;

use Nowo\SelectAllChoiceBundle\Form\SelectAllGroupsViewBuilder;
use Symfony\Component\Form\AbstractTypeExtension;
use Symfony\Component\Form\Extension\Core\Type\ChoiceType;
use Symfony\Component\Form\FormBuilderInterface;
use Symfony\Component\Form\FormEvent;
use Symfony\Component\Form\FormEvents;
use Symfony\Component\Form\FormInterface;
use Symfony\Component\Form\FormView;
use Symfony\Component\OptionsResolver\OptionsResolver;

use function is_array;
use function is_string;
use function preg_match;
use function trim;

/**
 * Form type extension that adds optional "Select all" support to ChoiceType when multiple=true.
 *
 * When the field option select_all is true, the Twig theme wraps the widget and passes config
 * via data attributes; the Stimulus controller creates and manages the toggle in the DOM.
 *
 * When select_all_groups is true (expanded only), the theme renders one fieldset per choice group with its own
 * "select all" box; the boxes have no name, so they are never submitted. The extension keeps no state between calls.
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
     * @param string $defaultGroupLabel Default translation key for the per-group box label (receives %group%)
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
        private readonly string $defaultGroupLabel = 'form.select_all_in_group',
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

        // Checkboxes (expanded): ChoiceType's own PRE_SUBMIT listener has already keyed the data by child name (the
        // ticked boxes' indexes), so the keys must stay; re-indexing ticked the first N boxes instead of the chosen ones.
        $expanded = (bool) ($options['expanded'] ?? false);

        // Clean up nulls from multi-select collections before ChoiceType processes the data
        $builder->addEventListener(FormEvents::PRE_SUBMIT, static function (FormEvent $event) use ($expanded): void {
            $data = $event->getData();
            if (!is_array($data)) {
                return;
            }

            // Remove null entries to avoid array_flip warnings in ChoiceType
            $data = array_filter(
                $data,
                static fn ($value): bool => $value !== null,
            );

            $event->setData($expanded ? $data : array_values($data));
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
            'select_all_groups'              => false,
            'select_all_group_key'           => null,
            'select_all_group_label'         => null,
            'select_all_groups_attr'         => [],
            'select_all_group_attr'          => [],
            'select_all_group_legend_attr'   => [],
            'select_all_group_toggle_attr'   => [],
            'select_all_group_choices_attr'  => [],
            'select_all_group_choice_attr'   => [],
        ]);

        $resolver->setAllowedTypes('select_all', 'bool');
        $resolver->setAllowedTypes('select_all_label', ['null', 'string']);
        $resolver->setAllowedValues('select_all_position', ['before', 'after']);
        $resolver->setAllowedTypes('select_all_css_class', 'string');
        $resolver->setAllowedTypes('select_all_wrapper_css_class', 'string');
        $resolver->setAllowedTypes('select_all_label_css_class', 'string');
        $resolver->setAllowedTypes('select_all_container_css_class', 'string');
        $resolver->setAllowedTypes('select_all_translation_domain', ['null', 'string']);
        $resolver->setAllowedTypes('select_all_groups', 'bool');
        $resolver->setAllowedTypes('select_all_group_key', ['null', 'string']);
        $resolver->setAllowedValues(
            'select_all_group_key',
            static fn (?string $value): bool => $value === null || preg_match('/^data-[a-z0-9][a-z0-9_.:-]*$/i', $value) === 1,
        );
        $resolver->setAllowedTypes('select_all_group_label', ['null', 'string']);
        $resolver->setAllowedTypes('select_all_groups_attr', 'array');
        $resolver->setAllowedTypes('select_all_group_attr', ['array', 'callable']);
        $resolver->setAllowedTypes('select_all_group_legend_attr', 'array');
        $resolver->setAllowedTypes('select_all_group_toggle_attr', 'array');
        $resolver->setAllowedTypes('select_all_group_choices_attr', 'array');
        $resolver->setAllowedTypes('select_all_group_choice_attr', 'array');
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

        $groupsEnabled = (bool) ($options['select_all_groups'] ?? false) && (bool) ($options['expanded'] ?? false);

        $view->vars['select_all_enabled']        = $options['select_all'];
        $view->vars['select_all_groups_enabled'] = $groupsEnabled;
        if (!$options['select_all'] && !$groupsEnabled) {
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

        if (!$groupsEnabled) {
            return;
        }

        $view->vars['select_all_group_label']       = $options['select_all_group_label'] ?? $this->defaultGroupLabel;
        $view->vars['select_all_groups_attr']       = SelectAllGroupsViewBuilder::mergeAttr([SelectAllGroupsViewBuilder::CLASS_GROUPS], $options['select_all_groups_attr']);
        $view->vars['select_all_group_legend_attr'] = SelectAllGroupsViewBuilder::mergeAttr([SelectAllGroupsViewBuilder::CLASS_GROUP_LEGEND], $options['select_all_group_legend_attr']);
        $view->vars['select_all_group_toggle_attr'] = SelectAllGroupsViewBuilder::mergeAttr(
            [SelectAllGroupsViewBuilder::CLASS_GROUP_TOGGLE_INPUT, $options['select_all_css_class']],
            $options['select_all_group_toggle_attr'],
            SelectAllGroupsViewBuilder::RESERVED_TOGGLE_ATTRIBUTES,
        );
        $view->vars['select_all_group_toggle_wrapper_class'] = trim(SelectAllGroupsViewBuilder::CLASS_GROUP_TOGGLE . ' ' . $options['select_all_wrapper_css_class']);
        $view->vars['select_all_group_toggle_label_class']   = trim(SelectAllGroupsViewBuilder::CLASS_GROUP_TOGGLE_LABEL . ' ' . $options['select_all_label_css_class']);
        $view->vars['select_all_group_choices_attr']         = SelectAllGroupsViewBuilder::mergeAttr([SelectAllGroupsViewBuilder::CLASS_GROUP_CHOICES], $options['select_all_group_choices_attr']);
        $view->vars['select_all_ungrouped_attr']             = SelectAllGroupsViewBuilder::mergeAttr([SelectAllGroupsViewBuilder::CLASS_UNGROUPED], $options['select_all_group_choices_attr']);
        $view->vars['select_all_group_choice_attr']          = SelectAllGroupsViewBuilder::mergeAttr([SelectAllGroupsViewBuilder::CLASS_CHOICE], $options['select_all_group_choice_attr']);
        $view->vars['select_all_group_sections']             = [];
    }

    /**
     * Builds the group sections once the children views exist (their ids and checked state feed the group boxes).
     *
     * @param FormView $view The form view
     * @param FormInterface<mixed> $form The form
     * @param array<string, mixed> $options The resolved options
     */
    public function finishView(FormView $view, FormInterface $form, array $options): void
    {
        if (!($view->vars['select_all_groups_enabled'] ?? false)) {
            return;
        }

        $groupKey = $options['select_all_group_key'];

        $view->vars['select_all_group_sections'] = (new SelectAllGroupsViewBuilder())->build(
            $view,
            is_string($groupKey) ? $groupKey : null,
            $options['select_all_group_attr'],
        );
    }
}
