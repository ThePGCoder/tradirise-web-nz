import { IconButton, InputAdornment, TextField } from "@mui/material";
import React from "react";
import { Icon } from "@iconify/react";
import { lightTheme, darkTheme } from "../styles/theme";
import { useThemeMode } from "@/hooks/useThemeMode";

interface CustomTextFieldProps {
  label: string;
  startIcon?: string;
  endIcon?: string;
  value: string;
  onChange: (value: string) => void;
  isPassword?: boolean;
  showPassword?: boolean;
  onTogglePassword?: () => void;
}

const CustomTextField: React.FC<CustomTextFieldProps> = ({
  label,
  startIcon,
  endIcon,
  value,
  onChange,
  isPassword = false,
  showPassword = false,
  onTogglePassword,
}) => {
  const { mode } = useThemeMode();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange(e.target.value);
  };

  const handleTogglePassword = () => {
    if (onTogglePassword) {
      onTogglePassword();
    }
  };

  return (
    <TextField
      label={label}
      type={isPassword && !showPassword ? "password" : "text"}
      value={value}
      onChange={handleChange}
      fullWidth
      InputProps={{
        startAdornment: startIcon && (
          <InputAdornment position="start">
            <Icon
              icon={startIcon}
              height={26}
              color={
                mode === "light"
                  ? lightTheme.palette.primary.main
                  : darkTheme.palette.primary.main
              }
            />
          </InputAdornment>
        ),
        endAdornment: (endIcon || isPassword) && (
          <InputAdornment position="end">
            {isPassword ? (
              <IconButton onClick={handleTogglePassword} edge="end">
                <Icon
                  icon={showPassword ? "mdi:eye-off" : "mdi:eye"}
                  height={22}
                />
              </IconButton>
            ) : endIcon ? (
              <Icon icon={endIcon} height={22} />
            ) : null}
          </InputAdornment>
        ),
      }}
      sx={{
        "& .MuiOutlinedInput-root": {
          "&:hover fieldset": {
            borderColor:
              mode === "light"
                ? lightTheme.palette.primary.main
                : darkTheme.palette.primary.main,
          },
        },
      }}
    />
  );
};

export default CustomTextField;
