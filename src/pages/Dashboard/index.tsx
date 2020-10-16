import React, { useCallback, useEffect, useState } from 'react';
import { useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/Feather';

import { useAuth } from './../../hooks/auth';

import api from '../../services/api';

import { 
    Container, 
    Header, 
    HeaderTitle, 
    UserName, 
    ProfileButton, 
    UserAvatar,
    ProvidersList,
    ProviderContainer,
    ProviderAvatar,
    ProviderInfo,
    ProviderName,
    ProviderMeta,
    ProviderMetaText,
    ProvidersListTitle
} from './style';

export interface Provider {
    id: string;
    name: string;
    avatar_url: string;
}

const Dashboard: React.FC = () => {
    const { signOut, user } = useAuth();
    const { navigate } = useNavigation();

    const [providers, setProviders] = useState<Provider[]>([]);

    useEffect(() => {
        api.get('/providers')
        .then(response => {
            setProviders(response.data);
        })
        .catch(err => {
            console.log(err);
        });
    }, []);

    const navigateToProfile = useCallback(() => {
        // navigate('Profile');
        signOut();
    }, [navigate, signOut]);

    const navigateToCreateAppointment = useCallback((providerId) => {
        navigate('CreateAppointment', { providerId });
    }, [navigate]);

    return (
        <Container>
            <Header>
                <HeaderTitle>
                    Bem-vindo(a), 
                    {"\n"}
                    <UserName>{ user.name }</UserName>
                </HeaderTitle>

                <ProfileButton onPress={navigateToProfile}>
                    <UserAvatar source={{ uri: user.avatar_url }} />
                </ProfileButton>
            </Header>

            <>
                <ProvidersList 
                    data={providers}
                    keyExtractor={provider => provider.id}
                    ListHeaderComponent={
                        <ProvidersListTitle>
                            Cabeleleireiros
                        </ProvidersListTitle>
                    }
                    renderItem={({ item: provider }) => (
                        <ProviderContainer onPress={() => navigateToCreateAppointment(provider.id)}>
                            <ProviderAvatar source={{ uri: provider.avatar_url }} />

                            <ProviderInfo>
                                <ProviderName>
                                    { provider.name }
                                </ProviderName>

                                <ProviderMeta>
                                    <Icon name="calendar" size={14} color="#ff9000" />
                                    <ProviderMetaText>
                                        Segunda à sexta
                                    </ProviderMetaText>
                                </ProviderMeta>
                                <ProviderMeta>
                                    <Icon name="clock" size={14} color="#ff9000" />
                                    <ProviderMetaText>
                                        8hrs às 18hrs
                                    </ProviderMetaText>
                                </ProviderMeta>
                            </ProviderInfo>
                        </ProviderContainer>
                    )}
                />
            </>
        </Container>
    );
}

export default Dashboard;