import React from 'react';
import { Image, KeyboardAvoidingView, Platform, View, ScrollView, Keyboard } from 'react-native';
import Icon from 'react-native-vector-icons/Feather';

import { Container, Title, ForgotPassword, ForgotPasswordText, CreateAccountButton, CreateAccountButtonText } from './style';
import logoImg from './../../assets/logo.png';
import Input from './../../components/Input';
import Button from './../../components/Button';

const SignIn: React.FC = () => {
    return (
        <>
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
                        <Image source={logoImg} />

                        <View>
                            <Title>Faça seu logon</Title>
                        </View>

                        <Input name="email" icon="mail" placeholder="E-mail" />
                        <Input name="password" icon="lock" placeholder="Senha" />

                        <Button onPress={() => {}}>Entrar</Button>

                        <ForgotPassword>
                            <ForgotPasswordText>Esqueci minha senha</ForgotPasswordText>
                        </ForgotPassword>
                    </Container>
                </ScrollView>
            </KeyboardAvoidingView>

            <CreateAccountButton>
                <Icon name="log-in" size={20} color="#ff9000" />
                <CreateAccountButtonText>
                    Criar conta
                </CreateAccountButtonText>
            </CreateAccountButton>
        </>
    );
}

export default SignIn;