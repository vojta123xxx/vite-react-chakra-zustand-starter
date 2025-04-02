import { useColorMode, useTheme, Box } from '@chakra-ui/react';
import Select, { 
  MultiValue, 
  SingleValue, 
  StylesConfig, 
  ThemeConfig,
  components,
  OptionProps,
  DropdownIndicatorProps,
  ClearIndicatorProps
} from 'react-select';
import { OptionType } from './types';
import { ChevronDownIcon, CloseIcon } from '@chakra-ui/icons';

interface CustomSelectProps {
  options: OptionType[];
  value: OptionType | null;
  onChange: (option: SingleValue<OptionType> | MultiValue<OptionType>) => void;
  placeholder?: string;
  isDisabled?: boolean;
  isSearchable?: boolean;
  isMulti?: boolean;
  isClearable?: boolean;
}

export const CustomSelect = ({
  options,
  value,
  onChange,
  placeholder = 'Vyberte možnost',
  isDisabled = false,
  isSearchable = false,
  isMulti = false,
  isClearable = false,
}: CustomSelectProps) => {
  const { colorMode } = useColorMode();
  const theme = useTheme();
  
  const isDark = colorMode === 'dark';
  
  // Barevné schéma podle light/dark režimu
  const colors = {
    bg: isDark ? theme.colors.gray[700] : 'white',
    text: isDark ? theme.colors.gray[100] : theme.colors.gray[800],
    placeholder: isDark ? theme.colors.gray[400] : theme.colors.gray[500],
    border: isDark ? theme.colors.gray[600] : theme.colors.gray[300],
    borderFocus: isDark ? theme.colors.teal[400] : theme.colors.teal[500],
    optionBgHover: isDark ? theme.colors.gray[600] : theme.colors.gray[100],
    optionBgSelected: isDark ? theme.colors.blue[600] : theme.colors.blue[500],
    indicator: isDark ? theme.colors.gray[400] : theme.colors.gray[500],
    indicatorHover: isDark ? theme.colors.gray[300] : theme.colors.gray[600],
  };

  // Vlastní komponenty
  const DropdownIndicator = (props: DropdownIndicatorProps<OptionType>) => {
    return (
      <components.DropdownIndicator {...props}>
        <ChevronDownIcon boxSize={4} />
      </components.DropdownIndicator>
    );
  };

  const ClearIndicator = (props: ClearIndicatorProps<OptionType>) => {
    return (
      <components.ClearIndicator {...props}>
        <CloseIcon boxSize={3} />
      </components.ClearIndicator>
    );
  };

  // Opravená verze – použijeme props.data.label
  const Option = (props: OptionProps<OptionType>) => {
    return (
      <components.Option {...props}>
        <Box py={1}>{props.data.label}</Box>
      </components.Option>
    );
  };

  const selectStyles: StylesConfig<OptionType> = {
    menu: (base) => ({
      ...base,
      backgroundColor: colors.bg,
      borderRadius: theme.radii.md,
      boxShadow: isDark 
        ? '0 4px 12px rgba(0, 0, 0, 0.3)' 
        : '0 4px 12px rgba(0, 0, 0, 0.1)',
      overflow: 'hidden',
      zIndex: 10,
    }),
    menuList: (base) => ({
      ...base,
      padding: '4px',
    }),
    option: (base, state) => ({
      ...base,
      backgroundColor: state.isSelected
        ? colors.optionBgSelected
        : state.isFocused
          ? colors.optionBgHover
          : 'transparent',
      color: state.isSelected
        ? 'white'
        : colors.text,
      padding: '8px 12px',
      borderRadius: theme.radii.sm,
      cursor: 'pointer',
      fontSize: '15px',
      transition: 'background-color 0.2s ease',
      '&:active': {
        backgroundColor: colors.optionBgHover,
      },
    }),
    singleValue: (base) => ({
      ...base,
      color: colors.text,
    }),
    input: (base) => ({
      ...base,
      color: colors.text,
    }),
    placeholder: (base) => ({
      ...base,
      color: colors.placeholder,
    }),
    dropdownIndicator: (base, state) => ({
      ...base,
      color: colors.indicator,
      padding: '6px',
      transform: state.selectProps.menuIsOpen ? 'rotate(180deg)' : 'rotate(0)',
      transition: 'transform 0.2s ease, color 0.2s ease',
      '&:hover': {
        color: colors.indicatorHover,
      },
    }),
    clearIndicator: (base) => ({
      ...base,
      color: colors.indicator,
      padding: '6px',
      '&:hover': {
        color: colors.indicatorHover,
        background: isDark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.05)',
        borderRadius: '50%',
      },
    }),
    indicatorSeparator: () => ({
      display: 'none',
    }),
    valueContainer: (base) => ({
      ...base,
      padding: '2px 8px',
    }),
    multiValue: (base) => ({
      ...base,
      backgroundColor: isDark ? theme.colors.blue[700] : theme.colors.blue[100],
      borderRadius: theme.radii.sm,
    }),
    multiValueLabel: (base) => ({
      ...base,
      color: isDark ? 'white' : theme.colors.blue[700],
      padding: '2px 6px 2px 8px',
      fontSize: '14px',
    }),
    multiValueRemove: (base) => ({
      ...base,
      color: isDark ? theme.colors.blue[300] : theme.colors.blue[500],
      ':hover': {
        backgroundColor: isDark ? theme.colors.red[600] : theme.colors.red[100],
        color: isDark ? 'white' : theme.colors.red[700],
      },
    }),
  };

  const selectTheme: ThemeConfig = (providedTheme) => ({
    ...providedTheme,
    colors: {
      ...providedTheme.colors,
      primary: colors.borderFocus,
      primary25: colors.optionBgHover,
      neutral0: colors.bg,
      neutral5: isDark ? theme.colors.gray[600] : theme.colors.gray[100],
      neutral10: isDark ? theme.colors.gray[600] : theme.colors.gray[200],
      neutral20: colors.border,
      neutral40: colors.indicator,
      neutral50: colors.placeholder,
      neutral60: colors.indicatorHover,
      neutral70: isDark ? theme.colors.gray[300] : theme.colors.gray[600],
      neutral80: colors.text,
      neutral90: isDark ? theme.colors.gray[100] : theme.colors.gray[900],
    },
    spacing: {
      ...providedTheme.spacing,
      controlHeight: 42,
      baseUnit: 4,
    },
    borderRadius: 6,
  });

  return (
    <Select
      placeholder={placeholder}
      value={value}
      onChange={(newValue) => onChange(isMulti 
        ? newValue as MultiValue<OptionType> 
        : newValue as SingleValue<OptionType>)}
      options={options}
      styles={selectStyles}
      theme={selectTheme}
      isDisabled={isDisabled}
      isSearchable={isSearchable}
      isMulti={isMulti}
      isClearable={isClearable}
      components={{
        DropdownIndicator,
        ClearIndicator,
        Option,
      }}
    />
  );
};
