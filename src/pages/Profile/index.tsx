import React, { useRef, useCallback } from 'react';
import { 
    KeyboardAvoidingView, 
    Platform, 
    View, 
    ScrollView, 
    TextInput,
    Alert
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Form } from '@unform/mobile';
import { FormHandles } from '@unform/core';
import * as Yup from 'yup';
import Icon from 'react-native-vector-icons/Feather';

import Input from './../../components/Input';
import Button from './../../components/Button';

import getValidationErrors from './../../utils/getValidationErrors';

import api from './../../services/api';

import { useAuth } from '../../hooks/auth';

import { Container, Title, UserAvatarButton, UserAvatar, BackButton } from './style';

interface SignUpFormData {
    name: string;
    email: string;
    password: string;
}

const SignUp: React.FC = () => {
    const { user } = useAuth();

    const navigation = useNavigation();
    const formRef = useRef<FormHandles>(null);
    const emailInputRef = useRef<TextInput>(null);
    const oldPasswordInputRef = useRef<TextInput>(null);
    const confirmPasswordInputRef = useRef<TextInput>(null);
    const passwordInputRef = useRef<TextInput>(null);

    const handleSignUp = useCallback(async (data: SignUpFormData) => {
        try {
            formRef.current?.setErrors({});

            const schema = Yup.object().shape({
                name: Yup.string().required('Nome obrigatório'),
                email: Yup.string().required('E-mail obrigatório').email('Digite um e-mail válido'),
                password: Yup.string().min(6, 'No mínimo 6 digitos')
            });

            await schema.validate(data, {
                abortEarly: false,
            });

            await api.post('/users', data);

            Alert.alert(
                'Cadastro realizado com sucesso!',
                'Você já pode fazer logon no GoBarber.',
            );

            navigation.goBack();
        } catch (err) {
            const errors = getValidationErrors(err);
            formRef.current?.setErrors(errors);

            Alert.alert(
                'Erro no cadastro',
                'Ocorreu um erro ao fazer o cadastro, tente novamente.',
            );
        }
    }, [navigation]);

    const handleGoBack = useCallback(() => {
        navigation.goBack();
    }, [navigation]);

    return (
        <ScrollView>
            <KeyboardAvoidingView 
                style={{ flex: 1 }}
                behavior={ Platform.OS === 'ios' ? 'padding' : undefined }
                enabled
            >
                <ScrollView 
                    keyboardShouldPersistTaps="handled"
                    contentContainerStyle={{ flex: 1 }}
                >
                    <Container>
                        <BackButton onPress={handleGoBack}>
                            <Icon name="chevron-left" size={24} color="#999591" />
                        </BackButton>
                        
                        <UserAvatarButton onPress={() => {}}>
                            <UserAvatar source={{ uri: user.avatar_url }} />
                        </UserAvatarButton>

                        <View>
                            <Title>Meu perfil</Title>
                        </View>
                        
                        <Form ref={formRef} onSubmit={handleSignUp}>
                            <Input 
                                autoCapitalize="words"
                                name="name" 
                                icon="user" 
                                placeholder="Nome" 
                                returnKeyType="next"
                                onSubmitEditing={() => {
                                    emailInputRef.current?.focus();
                                }}
                            />
                            <Input 
                                ref={emailInputRef}
                                keyboardType="email-address"
                                autoCorrect={false}
                                autoCapitalize="none"
                                name="email" 
                                icon="mail" 
                                placeholder="E-mail" 
                                returnKeyType="next"
                                onSubmitEditing={() => {
                                    oldPasswordInputRef.current?.focus();
                                }}
                            />
                            <Input 
                                ref={oldPasswordInputRef}
                                secureTextEntry
                                textContentType="newPassword"
                                name="old_password" 
                                icon="lock" 
                                placeholder="Senha atual" 
                                returnKeyType="next"
                                containerStyle={{ marginTop: 16 }}
                                onSubmitEditing={() => {
                                    passwordInputRef.current?.focus();
                                }}
                            />
                            <Input 
                                ref={passwordInputRef}
                                secureTextEntry
                                textContentType="newPassword"
                                name="password" 
                                icon="lock" 
                                placeholder="Nova senha" 
                                returnKeyType="next"
                                onSubmitEditing={() => {
                                    confirmPasswordInputRef.current?.focus();
                                }}
                            />
                            <Input 
                                ref={confirmPasswordInputRef}
                                secureTextEntry
                                textContentType="newPassword"
                                name="password" 
                                icon="lock" 
                                placeholder="Senha" 
                                returnKeyType="send"
                                onSubmitEditing={() => formRef.current?.submitForm()}
                            />
                        </Form>

                        <Button onPress={() => formRef.current?.submitForm()}>
                            Confirmar mudanças
                        </Button>
                    </Container>
                </ScrollView>
            </KeyboardAvoidingView>
        </ScrollView>
    );
}

export default SignUp;