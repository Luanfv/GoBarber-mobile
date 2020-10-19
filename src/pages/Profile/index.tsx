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

interface ProfileFormData {
    name: string;
    email: string;
    password: string;
    old_password: string;
    confirmation_password: string;
}

const SignUp: React.FC = () => {
    const { user, updateUser } = useAuth();

    const navigation = useNavigation();
    const formRef = useRef<FormHandles>(null);
    const emailInputRef = useRef<TextInput>(null);
    const oldPasswordInputRef = useRef<TextInput>(null);
    const confirmationPasswordInputRef = useRef<TextInput>(null);
    const passwordInputRef = useRef<TextInput>(null);

    const handleSignUp = useCallback(async (data: ProfileFormData) => {
        try {
            formRef.current?.setErrors({});

            const schema = Yup.object().shape({
                name: Yup.string().required('Nome obrigatório'),
                email: Yup.string().required('E-mail obrigatório').email('Digite um e-mail válido'),
                old_password: Yup.string(),
                password: Yup.string()
                .when('old_password', {
                    is: value => value.length,
                    then: Yup.string().min(6),
                    otherwise: Yup.string(),
                }),
                confirmation_password: Yup.string()
                .when('old_password', {
                    is: value => value.length,
                    then: Yup.string().min(6),
                    otherwise: Yup.string(),
                })
                .oneOf([Yup.ref('password')], 'Confirmação incorreta'),
            });

            await schema.validate(data, {
                abortEarly: false,
            });

            const updateProfile = !!data.old_password ? data : { email: data.email, name: data.name };
           
            const response = await api.put('/profile', updateProfile);

            updateUser(response.data);

            Alert.alert('Perfil atualizado com sucesso!');

            navigation.goBack();
        } catch (err) {
            if (err instanceof Yup.ValidationError) {
                const errors = getValidationErrors(err);
                formRef.current?.setErrors(errors);

                return;
            }

            Alert.alert(
                'Erro na atualização do perfil', 
                'Ocorreu um erro ao atualizar seu perfil, tente novamente'
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
                        
                        <Form initialData={user} ref={formRef} onSubmit={handleSignUp}>
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
                                    confirmationPasswordInputRef.current?.focus();
                                }}
                            />
                            <Input 
                                ref={confirmationPasswordInputRef}
                                secureTextEntry
                                textContentType="newPassword"
                                name="confirmation_password" 
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