<?php

declare(strict_types=1);

namespace Nowo\SelectAllChoiceBundle\Tests\Unit\Form;

use Nowo\SelectAllChoiceBundle\Form\SelectAllGroupsViewBuilder;
use PHPUnit\Framework\TestCase;
use Symfony\Component\Form\ChoiceList\View\ChoiceGroupView;
use Symfony\Component\Form\ChoiceList\View\ChoiceView;
use Symfony\Component\Form\FormView;

final class SelectAllGroupsViewBuilderTest extends TestCase
{
    public function testNestedGroupsAreFlattenedIntoTheirTopLevelGroup(): void
    {
        $view = $this->view(['0', '1', '2'], [
            'Incidents' => new ChoiceGroupView('Incidents', [
                '0'        => new ChoiceView('a', 'a', 'A'),
                'Severity' => new ChoiceGroupView('Severity', [
                    '1' => new ChoiceView('b', 'b', 'B'),
                ]),
            ]),
            '2' => new ChoiceView('c', 'c', 'C'),
        ]);

        $sections = (new SelectAllGroupsViewBuilder())->build($view, null, []);

        self::assertCount(2, $sections);
        self::assertSame('group', $sections[0]['type']);
        self::assertSame(['0', '1'], $sections[0]['children']);
        self::assertSame(['type' => 'ungrouped', 'children' => ['2']], $sections[1]);
    }

    public function testEmptyGroupsAndUnknownEntriesAreSkippedAndUndescribedChildrenKept(): void
    {
        $view = $this->view(['0', '1', 'orphan'], [
            'Empty' => new ChoiceGroupView('Empty', ['missing' => new ChoiceView('x', 'x', 'X')]),
            'junk'  => 'not a choice view',
            '0'     => new ChoiceView('a', 'a', 'A'),
            'dup'   => new ChoiceGroupView('Dup', ['0' => new ChoiceView('a', 'a', 'A')]),
            '1'     => new ChoiceView('b', 'b', 'B', ['data-group' => ['not', 'scalar']]),
        ]);

        $sections = (new SelectAllGroupsViewBuilder())->build($view, 'data-group', []);

        self::assertSame([['type' => 'ungrouped', 'children' => ['0', '1', 'orphan']]], $sections);
    }

    public function testChoicesVarThatIsNotAnArrayRendersEveryChildUngrouped(): void
    {
        $view                  = $this->view(['0'], []);
        $view->vars['choices'] = 'broken';

        self::assertSame([['type' => 'ungrouped', 'children' => ['0']]], (new SelectAllGroupsViewBuilder())->build($view, null, []));
    }

    public function testDataKeyGroupsMergeAndBlankValuesStayUngrouped(): void
    {
        $view = $this->view(['0', '1', '2', '3'], [
            '0' => new ChoiceView('a', 'a', 'A', ['data-group' => 'Tasks']),
            '1' => new ChoiceView('b', 'b', 'B', ['data-group' => '  ']),
            '2' => new ChoiceView('c', 'c', 'C', ['data-group' => 'Tasks']),
            '3' => new ChoiceView('d', 'd', 'D'),
        ]);

        $sections = (new SelectAllGroupsViewBuilder())->build($view, 'data-group', []);

        self::assertSame(['0', '2'], $sections[0]['children']);
        self::assertSame('Tasks', $sections[0]['label']);
        self::assertSame(['type' => 'ungrouped', 'children' => ['1', '3']], $sections[1]);
    }

    public function testStateIdsAndAttributes(): void
    {
        $view = $this->view(['0', '1', '2', '3', '4', '5'], [
            'All'   => new ChoiceGroupView('All', ['0' => new ChoiceView('a', 'a', 'A'), '1' => new ChoiceView('b', 'b', 'B')]),
            'Mixed' => new ChoiceGroupView('Mixed', ['2' => new ChoiceView('c', 'c', 'C'), '3' => new ChoiceView('d', 'd', 'D')]),
            'Off'   => new ChoiceGroupView('Off', ['4' => new ChoiceView('e', 'e', 'E'), '5' => new ChoiceView('f', 'f', 'F')]),
        ]);
        $view->children['0']->vars['checked']  = true;
        $view->children['1']->vars['checked']  = true;
        $view->children['2']->vars['checked']  = true;
        $view->children['4']->vars['checked']  = true;
        $view->children['4']->vars['disabled'] = true;
        $view->children['5']->vars['disabled'] = true;

        $sections = (new SelectAllGroupsViewBuilder())->build(
            $view,
            null,
            static fn (string $label, int $index): array|string => $index === 1 ? 'not an array' : ['class' => 'card', 'data-label' => $label],
        );

        self::assertSame(['checked', 'mixed', 'unchecked'], array_column($sections, 'state'));
        self::assertSame([false, false, true], array_column($sections, 'disabled'));
        self::assertSame('targets_0 targets_1', $sections[0]['controls']);
        self::assertSame('targets_select_all_group_2', $sections[2]['toggle_id']);
        self::assertSame(['class' => 'nowo-select-all-choice__group card', 'data-label' => 'All'], $sections[0]['attr']);
        self::assertSame(['class' => 'nowo-select-all-choice__group'], $sections[1]['attr']);
    }

    public function testToggleIdFallsBackWhenTheViewHasNoId(): void
    {
        $view = $this->view(['0'], ['G' => new ChoiceGroupView('G', ['0' => new ChoiceView('a', 'a', 'A')])]);
        unset($view->vars['id'], $view->children['0']->vars['id']);

        $sections = (new SelectAllGroupsViewBuilder())->build($view, null, []);

        self::assertSame('select_all_select_all_group_0', $sections[0]['toggle_id']);
        self::assertSame('', $sections[0]['controls']);
    }

    public function testMergeAttrPutsHookClassesFirstAndDropsReservedKeys(): void
    {
        self::assertSame(
            ['class' => 'hook-a hook-b host', 'data-x' => '1'],
            SelectAllGroupsViewBuilder::mergeAttr(['hook-a', 'hook-b'], ['class' => 'host', 'name' => 'n', 'data-x' => '1'], ['name']),
        );
        self::assertSame(['class' => 'hook'], SelectAllGroupsViewBuilder::mergeAttr(['hook'], ['class' => ['array']]));
        self::assertSame(
            ['class' => 'hook upper', 'data-ok' => '1'],
            SelectAllGroupsViewBuilder::mergeAttr(
                ['hook'],
                ['NAME' => 'x', 'Form' => 'other', 'Value' => 'v', 'CHECKED' => 'checked', 'CLASS' => 'upper', 'data-ok' => '1'],
                SelectAllGroupsViewBuilder::RESERVED_TOGGLE_ATTRIBUTES,
            ),
        );
    }

    /**
     * @param list<string> $children
     * @param array<int|string, mixed> $choices
     */
    private function view(array $children, array $choices): FormView
    {
        $view                  = new FormView();
        $view->vars['id']      = 'targets';
        $view->vars['choices'] = $choices;
        foreach ($children as $name) {
            $child                   = new FormView($view);
            $child->vars['id']       = 'targets_' . $name;
            $child->vars['checked']  = false;
            $child->vars['disabled'] = false;
            $view->children[$name]   = $child;
        }

        return $view;
    }
}
