import React, { FocusEvent, ChangeEvent } from 'react';
import styled from 'styled-components';

type InputProps = {
  id: string,
  type: string,
  placeholder: string,
  value?: string | number,
  labelText?: string,
  required?: boolean,
  inline?: boolean,
  additionalLabel?: string,
  onChange(event: ChangeEvent<HTMLInputElement>): void,
  onBlur?(event: FocusEvent<HTMLInputElement>): void,
  valid: boolean,
}


const InputWrapper = styled.div`
  width: 100%;
  height: 100%;
  margin-bottom: var(--space-l);

  &:last-child {
    margin-bottom: var(--space-xl);
  }

  display: ${(props: Partial<Pick<InputProps, 'inline'>>) => (props.inline ? 'flex' : 'block')};
  align-items: center;
`;

const StyledLabel = styled.label`
  display: block;
  font-size: var(--font-size-s);
  line-height: var(--line-height-s);
  letter-spacing: var(--letter-spacing-s);
  margin-bottom: ${(props: Partial<Pick<InputProps, 'inline'>>) => (props.inline ? 0 : 'var(--space-xxxxs)')};
  margin-right: ${(props: Partial<Pick<InputProps, 'inline'>>) => (props.inline ? 'var(--space-xxxs)' : 0)};
`;

const StyledInput = styled.input`
  padding: 11px 13px 10px;
  display: inline-block;
  width: 100%;
  border: 2px solid
    ${(props: InputProps) =>
      props.valid === true
        ? 'var(--border-color)'
        : 'var(--border-color-invalid)'};
  border-radius: var(--border-radius-m);
  font-size: var(--font-size-s);
  line-height: var(--line-height-xxs);
  color: var(--text-color-default);

  &::placeholder {
    color: ${(props: InputProps) =>
      props.valid === true
        ? 'var(--placeholder-text)'
        : 'var(--border-color-invalid)'};
  }

  &:focus {
    border-color: var(--border-color-focus);
  }

  max-width: ${(props: Partial<Pick<InputProps, 'inline'>>) => (props.inline ? '26px' : '474px')};
  text-align: ${(props: Partial<Pick<InputProps, 'inline'>>) => (props.inline ? 'right' : 'left')};
  margin-right: ${(props: Partial<Pick<InputProps, 'inline'>>) => (props.inline ? 'var(--space-xxxs)' : 0)};
`;

export const Input: React.FC<InputProps> = ({
  id,
  type,
  placeholder,
  value,
  labelText,
  required,
  inline,
  additionalLabel,
  onChange,
  onBlur,
  valid,
}) => {
  return (
    <InputWrapper inline={inline}>
      {labelText ? (
        <StyledLabel htmlFor={id} inline={inline}>
          {labelText}{' '}
          {required ? (
            <span style={{ color: 'var(--text-color-danger)' }}>*</span>
          ) : null}
        </StyledLabel>
      ) : null}
      <StyledInput
        type={type}
        id={id}
        placeholder={placeholder}
        value={value}
        inline={inline}
        onChange={onChange}
        onBlur={onBlur}
        valid={valid}
      />
      {additionalLabel ? (
        <StyledLabel htmlFor={id} inline={inline}>
          {additionalLabel}
        </StyledLabel>
      ) : null}
    </InputWrapper>
  );
};
