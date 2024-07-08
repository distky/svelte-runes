import { Combobox as ComboboxPrimitive } from 'bits-ui';

import Label from './combobox-label.svelte';
import Input from './combobox-input.svelte';
import Item from './combobox-item.svelte';
import Content from './combobox-content.svelte';
import Separator from './combobox-separator.svelte';

const Root = ComboboxPrimitive.Root;
const Group = ComboboxPrimitive.Group;
const HiddenInput = ComboboxPrimitive.HiddenInput;

export {
	Root,
	Group,
	Input,
	Label,
	Item,
	Content,
	Separator,
	HiddenInput,
	//
	Root as Select,
	Group as SelectGroup,
	Input as SelectInput,
	Label as SelectLabel,
	Item as SelectItem,
	Content as SelectContent,
	Separator as SelectSeparator
};
