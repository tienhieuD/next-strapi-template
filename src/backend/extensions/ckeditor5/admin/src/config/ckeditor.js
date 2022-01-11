import colorConfig, { colors } from './color';

module.exports = {
	// Override toolbar config to leave a few buttons
	toolbar: {
		items: [
			'heading',
			'|',
			'fontsize',
			'fontfamily',
			'fontcolor',
			'fontBackgroundColor',
			'|',
			'bold',
			'italic',
			'underline',
			'link',
			'bulletedList',
			'numberedList',
			'imageInsert',
			'strapiMediaLib',
			'|',
			'alignment',
			'indent',
			'outdent',
			'|',
			'specialCharacters',
			'blockQuote',
			'insertTable',
			'mediaEmbed',
			'htmlEmbed',
			'horizontalLine',
			'|',
			'undo',
			'redo',
			'|',
			'findAndReplace',
			'wordCount',
		]
	},
	fontColor: colorConfig,
	fontBackgroundColor: colorConfig,
	fontSize: {
		options: [
			8,
			9,
			10,
			11,
			12,
			14,
			16,
			18,
			20,
			24,
			26,
			28,
			36,
			48,
			72,
			'default',
		]
	},
	table: {
		contentToolbar: [
			'tableColumn', 'tableRow', 'mergeTableCells',
			'tableProperties', 'tableCellProperties',
			'toggleTableCaption'
		],
		tableProperties: {
			borderColors: colors.filter((color, index) => index % 2 === 1),
			backgroundColors: colors.filter((color, index) => index % 2 === 1)
		},

		// Set the palettes for table cells.
		tableCellProperties: {
			borderColors: colors.filter((color, index) => index % 2 === 1),
			backgroundColors: colors.filter((color, index) => index % 2 === 1)
		}
	},
	image: {
		styles: [
			'alignLeft',
			'alignCenter',
			'alignRight'
		],
		resizeOptions: [
			{
				name: 'imageResize:original',
				value: null,
				icon: 'original'
			},
			{
				name: 'imageResize:50',
				value: '50',
				icon: 'medium'
			},
			{
				name: 'imageResize:75',
				value: '75',
				icon: 'large'
			}
		],
		toolbar: [
			'imageStyle:alignLeft',
			'imageStyle:alignCenter',
			'imageStyle:alignRight',
			'|',
			'imageTextAlternative',
			'|',
			'imageResize:50',
			'imageResize:75',
			'imageResize:original',
			'|',
			'linkImage'
		]
	},
};