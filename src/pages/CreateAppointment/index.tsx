import React, { useCallback, useEffect, useState, useMemo } from 'react';
import { Platform, Alert } from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/Feather';
import DateTimePicker from '@react-native-community/datetimepicker';
import { format } from 'date-fns';

import { useAuth } from '../../hooks/auth';

import api from '../../services/api';

import { 
    Container, 
    Header, 
    BackButton, 
    HeaderTitle, 
    Content, 
    UserAvatar, 
    ProvidersListContainer,
    ProvidersList,
    ProviderContainer,
    ProviderAvatar,
    ProviderName,
    Calendar,
    Title,
    OpenDatePickerButton,
    OpenDatePickerButtonText,
    Schedule,
    Section,
    SectionTitle,
    SectionContent,
    Hour,
    HourText,
    CreateAppointmentButton,
    CreateAppointmentButtonText,
} from './style';

interface RouteParams {
    providerId: string;
}

export interface Provider {
    id: string;
    name: string;
    avatar_url: string;
}

interface AvailabilityItem {
    hour: number;
    available: boolean;
}

const CreateAppointment: React.FC = () => {
    const route = useRoute();
    const { user } = useAuth();
    const { goBack, navigate } = useNavigation();

    const routeParams = route.params as RouteParams;

    const [providers, setProviders] = useState<Provider[]>([]);
    const [selectedProvider, setSelectedProvider] = useState(routeParams.providerId);
    const [showDatePicker, setShowDatePicker] = useState(false);
    const [selectedDate, setSelectedDate] = useState(new Date());
    const [selectedHour, setSelectedHour] = useState(0);
    const [availability, setAvailability] = useState<AvailabilityItem[]>([]);

    const morningAvailability = useMemo(() => {
        return availability
        .filter(({ hour }) => hour < 12
        ).map(({ hour, available }) => ({
            hour,
            available, 
            hourFormated: format(new Date().setHours(hour), 'HH:00'),
        }));
    }, [availability]);

    const afternoonAvailability = useMemo(() => {
        return availability
        .filter(({ hour }) => hour >= 12
        ).map(({ hour, available }) => ({
            hour,
            available, 
            hourFormated: format(new Date().setHours(hour), 'HH:00'),
        }));
    }, [availability]);

    useEffect(() => {
        api.get('/providers')
        .then(response => {
            setProviders(response.data);
        })
        .catch(err => {
            console.log(err);
        });
    }, []);

    useEffect(() => {
        api.get(`/providers/${selectedProvider}/day-availability`, {
            params: {
                year: selectedDate.getFullYear(),
                month: selectedDate.getMonth() + 1,
                day: selectedDate.getDate(),
            }
        })
        .then(response => {
            setAvailability(response.data);
        });

        setSelectedHour(0);
    }, [selectedDate, selectedProvider]);

    const navigateBack = useCallback(() => {
        goBack();
    }, []);

    const handleSelectProvider = useCallback((providerId: string) => {
        setSelectedProvider(providerId);
    }, []);

    const handleToggleDatePicker = useCallback(() => {
        setShowDatePicker(state => !state);
    }, []);

    const handeDateChange = useCallback((event: any, date: Date | undefined) => {
        if (Platform.OS === 'android')
            setShowDatePicker(false);

        if (!!date)
            setSelectedDate(date);
    }, []);

    const handleSelectHour = useCallback((hour: number) => {
        setSelectedHour(hour);
    }, []);

    const handleCreateAppointment = useCallback(async () => {
        try {
            const date = new Date(selectedDate);

            date.setHours(selectedHour);
            date.setMinutes(0);

            await api.post('/appointments', {
                provider_id: selectedProvider,
                date,
            });

            navigate('AppointmentCreated', { date: date.getTime() });
        }
        catch (err) {
            Alert.alert(
                'Erro ao criar agendamento', 
                'Ocorreu um erro ao criar esse agendamento, tente novamente.'
            );
        }
    }, [selectedDate, selectedHour, selectedProvider, navigate]);

    return (
        <Container>
            <Header>
                <BackButton onPress={navigateBack}>
                    <Icon name="chevron-left" size={24} color="#999591" />
                </BackButton>

                <HeaderTitle>
                    Cabeleireiros
                </HeaderTitle>

                <UserAvatar source={{ uri: user.avatar_url }} />
            </Header>
            
            <Content>
                <ProvidersListContainer>
                    <ProvidersList
                        horizontal
                        showsHorizontalScrollIndicator={false}
                        data={providers}
                        keyExtractor={provider => provider.id}
                        renderItem={({ item: provider }) => (
                            <ProviderContainer 
                                selected={provider.id === selectedProvider}
                                onPress={() => handleSelectProvider(provider.id)}
                            >
                                <ProviderAvatar source={{ uri: provider.avatar_url }} />
                                
                                <ProviderName selected={provider.id === selectedProvider}>
                                    {provider.name}
                                </ProviderName>
                            </ProviderContainer>
                        )}
                    />
                </ProvidersListContainer>

                <Calendar>
                    <Title>Escolha a data</Title>
                    
                            <OpenDatePickerButton onPress={handleToggleDatePicker}>
                                <OpenDatePickerButtonText>
                                    Selecionar outra data
                                </OpenDatePickerButtonText>
                            </OpenDatePickerButton>

                    {
                        showDatePicker
                        &&
                        <DateTimePicker 
                            mode="date"
                            is24Hour
                            onChange={handeDateChange}
                            display="calendar"
                            value={selectedDate}
                        />
                    }
                </Calendar>

                <Schedule>
                    <Title>
                        Escolha o hórario
                    </Title>

                    <Section>
                        <SectionTitle>
                            Manhã
                        </SectionTitle>

                        <SectionContent>
                            {
                                morningAvailability.map(({ hourFormated, hour, available }) => (
                                    <Hour 
                                        enabled={available}
                                        selected={selectedHour === hour}
                                        available={available} 
                                        key={hourFormated}
                                        onPress={() => handleSelectHour(hour)}
                                    >
                                        <HourText selected={selectedHour === hour}>
                                            {hourFormated}
                                        </HourText>
                                    </Hour>
                                ))
                            }
                        </SectionContent>
                    </Section>

                    <Section>
                        <SectionTitle>
                            Tarde
                        </SectionTitle>

                        <SectionContent>
                            {
                                afternoonAvailability.map(({ hourFormated, hour, available }) => (
                                    <Hour 
                                        enabled={available}
                                        selected={selectedHour === hour}
                                        available={available} 
                                        key={hourFormated}
                                        onPress={() => handleSelectHour(hour)}
                                    >
                                        <HourText selected={selectedHour === hour}>
                                            {hourFormated}
                                        </HourText>
                                    </Hour>
                                ))
                            }
                        </SectionContent>
                    </Section>
                </Schedule>

                <CreateAppointmentButton onPress={handleCreateAppointment}>
                    <CreateAppointmentButtonText>
                        Agendar
                    </CreateAppointmentButtonText>
                </CreateAppointmentButton>
            </Content>
        </Container>
    );
}

export default CreateAppointment;