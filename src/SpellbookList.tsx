import React from 'react';

type SpellbookListItemProps = {
    name: string,
    spellcasterClass: string,
    spellcasterLevel: number
};

const SpellbookListItem: React.FC<SpellbookListItemProps> = (props : SpellbookListItemProps) => (
    <li className="spellbooklistitem">
        <div className="spellbooklistitem_name">{props.name}</div>
        <div className="spellbooklistitem_spellcasterclass">Level {props.spellcasterLevel} {props.spellcasterClass}</div>
    </li>
);

type SpellbookListProps = {
    spellbooks: SpellbookListItemProps[]
};

const SpellbookList: React.FC<SpellbookListProps> = (props : SpellbookListProps) => (
    <ul className="spellbooklist">
        {
            props.spellbooks.map(spellbook =>
                <SpellbookListItem 
                    key={spellbook.name} 
                    {...spellbook}
                />
            )
        }
    </ul>
);

export default SpellbookList;
