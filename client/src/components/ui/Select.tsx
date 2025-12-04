import React from 'react';
import { Select as AntSelect } from 'antd';
import type { SelectProps as AntSelectProps, RefSelectProps } from 'antd';
import { cva } from 'class-variance-authority';
import { cn } from '@/lib/utils';

type SelectVariant = 'default' | 'filled' | 'borderless';
type SelectSize = 'sm' | 'md' | 'lg';

const selectVariants = cva(
  'w-full transition-all !border !text-sm',
  {
    variants: {
      variant: {
        default: '!border-input !bg-background focus:!border-primary hover:!border-primary',
        filled: '!bg-muted !border-border focus:!border-primary hover:!border-primary',
        borderless: '!border-transparent !bg-transparent hover:!border-transparent',
      },
      size: {
        sm: 'h-8 !text-sm',
        md: 'h-10 md:!text-base',
        lg: 'h-11 md:!text-base',
      },
      status: {
        error: '!border-danger hover:!border-danger focus:!border-danger',
        warning: '!border-warning hover:!border-warning focus:!border-warning',
        success: '!border-success hover:!border-success focus:!border-success',
      },
      disabled: {
        true: 'opacity-50 cursor-not-allowed !bg-muted',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'md',
    },
  }
);

interface BaseSelectProps {
  variant?: SelectVariant;
  size?: SelectSize;
  status?: 'error' | 'warning' | 'success';
  fullWidth?: boolean;
  className?: string;
}

export const Select = React.forwardRef<RefSelectProps, BaseSelectProps & Omit<AntSelectProps, 'size'>>(({
  className,
  variant,
  status,
  disabled,
  size,
  ...props
}, ref) => {
  const antStatus = status as AntSelectProps['status'];

  return (
    <AntSelect
      className={cn(selectVariants({ variant, status, disabled, size }), className)}
      status={antStatus}
      disabled={disabled}
      ref={ref}
      {...props}
    />
  );
});

Select.displayName = 'Select';


export const { Option, OptGroup } = AntSelect;