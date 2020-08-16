import React, { 
    useEffect, 
    useRef, 
    useImperativeHandle, 
    forwardRef, 
    useState,
    useCallback
} from 'react';
import { TextInputProps } from 'react-native';
import Icon from 'react-native-vector-icons/Feather';
import { useField } from '@unform/core';

import { Container, TextInput } from './style';

interface InputProps extends TextInputProps {
    name: string;
    icon: string;
}

interface InputValueReference {
    value: string;
}

interface InputRef {
    focus(): void;
}

const Input: React.RefForwardingComponent<InputRef, InputProps> = ({ name, icon, ...rest }, ref) => {
    const { registerField, defaultValue = '', fieldName, error } = useField(name);
    const inputValueRef = useRef<InputValueReference>({ value: defaultValue});
    const inputElementRef = useRef<any>(null);

    const [isFocus, setIsFocus] = useState(false);
    const [isField, setIsField] = useState(false);

    const handleIsInputFocus = useCallback(() => {
        setIsFocus(true);
    }, []);

    const handleIsInputBlur = useCallback(() => {
        setIsFocus(false);

        setIsField(!!inputValueRef.current.value);
    }, []);

    useImperativeHandle(ref, () => ({
        focus() {
            inputElementRef.current.focus();
        }
    }));

    useEffect(() => {
        registerField<string>({
            name: fieldName,
            ref: inputValueRef.current,
            path: 'value',
            setValue(ref: any, value) {
                inputValueRef.current.value = value;
                inputElementRef.current.setNativeProps({ text: value })
            },
            clearValue() {
                inputValueRef.current.value = '';
                inputElementRef.current.clear();
            }
        });
    }, [fieldName, registerField]);

    return (
        <Container isFocus={isFocus} isError={!!error}>
            <Icon name={icon} size={20} color={isFocus || isField ? '#ff9000' : '#666360'}  />

            <TextInput
                ref={inputElementRef}
                placeholderTextColor="#666360"
                defaultValue={defaultValue}
                onFocus={handleIsInputFocus}
                onBlur={handleIsInputBlur}
                onChangeText={value => inputValueRef.current.value = value}
                {...rest} 
            />
        </Container>
    );
};

export default forwardRef(Input);