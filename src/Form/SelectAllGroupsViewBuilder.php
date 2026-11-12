<?php

declare(strict_types=1);

namespace Nowo\SelectAllChoiceBundle\Form;

use Symfony\Component\Form\ChoiceList\View\ChoiceGroupView;
use Symfony\Component\Form\ChoiceList\View\ChoiceView;
use Symfony\Component\Form\FormView;

use function array_key_exists;
use function count;
use function implode;
use function in_array;
use function is_array;
use function is_callable;
use function is_scalar;
use function strtolower;
use function trim;

/**
 * Builds the per-group "select all" sections of an expanded multiple ChoiceType view.
 *
 * Groups come from the choice list groups (`group_by`, nested `choices` / optgroups) and, for choices outside a group,
 * from an optional `data-*` key of `choice_attr`. Choices without a group are kept in "ungrouped" sections, in their
 * original order. The builder is stateless: every call works only on the view and the options it is given.
 *
 * @internal
 */
final class SelectAllGroupsViewBuilder
{
    /** BEM hook class of the element that holds every section (the grid of group cards). */
    public const CLASS_GROUPS = 'nowo-select-all-choice__groups';

    /** BEM hook class of one group container (the `fieldset`). */
    public const CLASS_GROUP = 'nowo-select-all-choice__group';

    /** BEM hook class of a group `legend`. */
    public const CLASS_GROUP_LEGEND = 'nowo-select-all-choice__group-legend';

    /** BEM hook class of the element that wraps a group box and its label. */
    public const CLASS_GROUP_TOGGLE = 'nowo-select-all-choice__group-toggle';

    /** BEM hook class of a group box (the checkbox). */
    public const CLASS_GROUP_TOGGLE_INPUT = 'nowo-select-all-choice__group-toggle-input';

    /** BEM hook class of a group box label. */
    public const CLASS_GROUP_TOGGLE_LABEL = 'nowo-select-all-choice__group-toggle-label';

    /** BEM hook class of the children list of a group. */
    public const CLASS_GROUP_CHOICES = 'nowo-select-all-choice__group-choices';

    /** BEM hook class of the list of choices outside any group. */
    public const CLASS_UNGROUPED = 'nowo-select-all-choice__ungrouped';

    /** BEM hook class of one child (checkbox + label) inside a group or the ungrouped list. */
    public const CLASS_CHOICE = 'nowo-select-all-choice__choice';

    /**
     * Attributes a host cannot set on a group box: they would submit it, break its label or desync its state.
     *
     * @var list<string>
     */
    public const RESERVED_TOGGLE_ATTRIBUTES = [
        'name', 'form', 'value', 'type', 'id', 'checked', 'disabled',
        'aria-controls', 'aria-checked', 'data-select-all-target',
    ];

    /**
     * @param FormView $view The ChoiceType view (children already built)
     * @param string|null $groupKey Optional `choice_attr` key (e.g. "data-group") that groups the choices outside a group
     * @param array<string, mixed>|callable $groupAttr Attributes of each group container, or a callable (label, index): array
     *
     * @return list<array<string, mixed>> Sections in display order
     */
    public function build(FormView $view, ?string $groupKey, array|callable $groupAttr): array
    {
        /** @var array<int, array{label: string|null, children: list<string>}> $raw */
        $raw = [];
        /** @var array<string, int> $groupPositions */
        $groupPositions = [];
        /** @var array<string, true> $seen */
        $seen = [];

        // Preferred choices are only in preferred_choices when duplicate_preferred_choices is false: walk both lists
        // (in that order of precedence for grouping), $seen keeps each child once.
        $choices   = $view->vars['choices'] ?? [];
        $preferred = $view->vars['preferred_choices'] ?? [];
        $entries   = [];
        foreach ([$choices, $preferred] as $list) {
            foreach (is_array($list) ? $list : [] as $key => $choice) {
                $entries[] = [$key, $choice];
            }
        }
        foreach ($entries as [$key, $choice]) {
            if ($choice instanceof ChoiceGroupView) {
                $this->addToGroup($raw, $groupPositions, $choice->label, $this->leafNames($view, $choice, $seen));

                continue;
            }

            if (!$choice instanceof ChoiceView || !$this->claim($view, (string) $key, $seen)) {
                continue;
            }

            $label = $this->groupLabelFromAttr($choice, $groupKey);
            if ($label === null) {
                $this->addUngrouped($raw, (string) $key);

                continue;
            }

            $this->addToGroup($raw, $groupPositions, $label, [(string) $key]);
        }

        // Children the choice list did not describe (should not happen) are still rendered, never dropped.
        foreach ($view->children as $name => $child) {
            if (!isset($seen[(string) $name])) {
                $seen[(string) $name] = true;
                $this->addUngrouped($raw, (string) $name);
            }
        }

        $sections   = [];
        $groupIndex = 0;
        foreach ($raw as $section) {
            if ($section['label'] === null) {
                $sections[] = ['type' => 'ungrouped', 'children' => $section['children']];

                continue;
            }

            $sections[] = $this->describeGroup($view, $section['label'], $section['children'], $groupIndex, $groupAttr);
            ++$groupIndex;
        }

        return $sections;
    }

    /**
     * Merges hook classes in front of the host's `class` attribute and drops the reserved keys (case-insensitive).
     *
     * @param list<string> $hookClasses Classes the bundle always outputs (CSS hooks)
     * @param array<mixed> $attr Host attributes
     * @param list<string> $reserved Attribute names to drop
     *
     * @return array<string, mixed>
     */
    public static function mergeAttr(array $hookClasses, array $attr, array $reserved = []): array
    {
        // HTML attribute names are case-insensitive: compare lower-cased, so NAME / Form / Checked are dropped too.
        $merged    = [];
        $hostClass = '';
        foreach ($attr as $name => $value) {
            $name  = (string) $name;
            $lower = strtolower($name);
            if ($lower === 'class') {
                $hostClass = trim($hostClass . ' ' . (is_scalar($value) ? (string) $value : ''));

                continue;
            }
            if (in_array($lower, $reserved, true)) {
                continue;
            }
            $merged[$name] = $value;
        }

        return ['class' => trim(implode(' ', $hookClasses) . ' ' . $hostClass)] + $merged;
    }

    /**
     * @param list<string> $children
     * @param array<string, mixed>|callable $groupAttr
     *
     * @return array<string, mixed>
     */
    private function describeGroup(FormView $view, string $label, array $children, int $index, array|callable $groupAttr): array
    {
        $ids     = [];
        $enabled = 0;
        $checked = 0;
        foreach ($children as $name) {
            $vars  = $view->children[$name]->vars;
            $ids[] = (string) ($vars['id'] ?? '');
            if ($vars['disabled'] ?? false) {
                continue;
            }
            ++$enabled;
            if ($vars['checked'] ?? false) {
                ++$checked;
            }
        }

        $state = match (true) {
            $enabled > 0 && $checked === $enabled => 'checked',
            $checked === 0                        => 'unchecked',
            default                               => 'mixed',
        };

        $attr = is_callable($groupAttr) ? $groupAttr($label, $index) : $groupAttr;

        return [
            'type'      => 'group',
            'index'     => $index,
            'label'     => $label,
            'children'  => $children,
            'toggle_id' => ($view->vars['id'] ?? 'select_all') . '_select_all_group_' . $index,
            'controls'  => implode(' ', $ids),
            'state'     => $state,
            'disabled'  => $enabled === 0,
            'attr'      => self::mergeAttr([self::CLASS_GROUP], is_array($attr) ? $attr : []),
        ];
    }

    /**
     * @param array<string, true> $seen
     *
     * @return list<string>
     */
    private function leafNames(FormView $view, ChoiceGroupView $group, array &$seen): array
    {
        $names = [];
        foreach ($group->choices as $key => $choice) {
            if ($choice instanceof ChoiceGroupView) {
                // Nested groups are flattened into their top-level group: one box per top-level group.
                foreach ($this->leafNames($view, $choice, $seen) as $name) {
                    $names[] = $name;
                }

                continue;
            }
            if ($this->claim($view, (string) $key, $seen)) {
                $names[] = (string) $key;
            }
        }

        return $names;
    }

    /**
     * @param array<string, true> $seen
     */
    private function claim(FormView $view, string $name, array &$seen): bool
    {
        if (isset($seen[$name]) || !isset($view->children[$name])) {
            return false;
        }
        $seen[$name] = true;

        return true;
    }

    private function groupLabelFromAttr(ChoiceView $choice, ?string $groupKey): ?string
    {
        if ($groupKey === null || !array_key_exists($groupKey, $choice->attr)) {
            return null;
        }
        $value = $choice->attr[$groupKey];
        if (!is_scalar($value) || trim((string) $value) === '') {
            return null;
        }

        return (string) $value;
    }

    /**
     * @param array<int, array{label: string|null, children: list<string>}> $raw
     * @param array<string, int> $positions
     * @param list<string> $names
     */
    private function addToGroup(array &$raw, array &$positions, string $label, array $names): void
    {
        if ($names === []) {
            return;
        }
        if (!isset($positions[$label])) {
            $positions[$label] = count($raw);
            $raw[]             = ['label' => $label, 'children' => $names];

            return;
        }
        $position       = $positions[$label];
        $raw[$position] = ['label' => $label, 'children' => [...$raw[$position]['children'], ...$names]];
    }

    /**
     * @param array<int, array{label: string|null, children: list<string>}> $raw
     */
    private function addUngrouped(array &$raw, string $name): void
    {
        $last = count($raw) - 1;
        if ($last >= 0 && $raw[$last]['label'] === null) {
            $raw[$last] = ['label' => null, 'children' => [...$raw[$last]['children'], $name]];

            return;
        }
        $raw[] = ['label' => null, 'children' => [$name]];
    }
}
