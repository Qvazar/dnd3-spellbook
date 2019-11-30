import React from 'react';

type SpellbookItemTableRowProps = {
    name: string,
    castingTime: string,
    range: string,
    savingThrow: string,
    effect: string
};

const SpellbookItemTableRow: React.FC<SpellbookItemTableRowProps> = (props : SpellbookItemTableRowProps) => (
    <tr className="spellbookitemtablerow">
        <td className="name">{props.name}</td>
        <td className="castingtime">{props.castingTime}</td>
        <td className="range">{props.range}</td>
        <td className="savingthrow">{props.savingThrow}</td>
        <td className="effect">{props.effect}</td>
    </tr>
);

export default SpellbookItemTableRow;
