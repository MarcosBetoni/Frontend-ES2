import { Document, Page, Text, View, StyleSheet } from '@react-pdf/renderer';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { MeetingFormApiData } from '../../types/meeting';

interface MeetingReportProps {
  meeting: MeetingFormApiData;
}

// Create styles
const styles = StyleSheet.create({
  page: {
    padding: 30,
    fontFamily: 'Helvetica',
  },
  header: {
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 14,
    color: '#666',
    marginBottom: 5,
  },
  section: {
    marginTop: 15,
    marginBottom: 10,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  text: {
    fontSize: 12,
    marginBottom: 5,
    lineHeight: 1.4,
  },
  agendaItem: {
    marginBottom: 8,
  },
  attendeesList: {
    marginTop: 5,
  },
  attendee: {
    fontSize: 12,
    marginBottom: 3,
  },
  minutes: {
    marginTop: 10,
    fontSize: 12,
    lineHeight: 1.6,
  },
});

export function MeetingReport({ meeting }: MeetingReportProps) {
    console.log(meeting)

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>{meeting.titulo}</Text>
          <Text style={styles.subtitle}>
            Data: {format(new Date(meeting.dataHora), "dd 'de' MMMM 'de' yyyy", { locale: ptBR })}
          </Text>
          <Text style={styles.subtitle}>
            Horário: {format(new Date(meeting.dataHora), "HH:mm 'h'", { locale: ptBR })}
          </Text>
          <Text style={styles.subtitle}>Local: {meeting.local}</Text>
        </View>

        {/* Agenda Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Pautas</Text>
          {meeting.pautas.map((agenda, index) => (
            <View key={agenda.id} style={styles.agendaItem}>
              <Text style={styles.text}>
                {index + 1}. {agenda.titulo}
              </Text>
              <Text style={styles.text}>{agenda.descricao}</Text>
            </View>
          ))}
        </View>

        {/* Attendees Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Participantes</Text>
          <View style={styles.attendeesList}>
            {meeting.membrosParticipantes.map((attendee) => (
              <Text key={attendee.id} style={styles.attendee}>
                • {attendee.nome} ({attendee.email}) - {attendee.estaPresente}
              </Text>
            ))}
          </View>
        </View>

        {/* Minutes Section */}
        {meeting.ata && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Ata da Reunião</Text>
            <Text style={styles.minutes}>{meeting.ata}</Text>
          </View>
        )}
      </Page>
    </Document>
  );
}