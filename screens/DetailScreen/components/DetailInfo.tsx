import { IMama } from '@/types/mama';
import { Fragment } from 'react';
import { StyleSheet, View } from 'react-native';
import { Card, Divider, Icon, Text } from 'react-native-paper';

export default function DetailInfo({ mama }: { mama: IMama | null }) {
  const infoData = [
    {
      icon: 'phone',
      title: 'No. Telepon',
      value: mama?.phone,
    },
    {
      icon: 'calendar',
      title: 'Usia Kehamilan',
      value: mama?.pregnancyAge,
    },
    {
      icon: 'calendar',
      title: 'Tanggal Perkiraan Lahir',
      value: mama?.expectedBirthdate,
    },
    {
      icon: 'home',
      title: 'Alamat',
      value: mama?.address,
    },
    {
      icon: 'note',
      title: 'Catatan',
      value: mama?.note,
    }
  ]

  return (
    <Card style={styles.card}>
      {infoData.map((item, index) => (
        <Fragment key={index}>
          <Card.Content style={styles.cardContent}>
            <View style={styles.iconContainer}>
              <Icon source={item.icon} size={20} />
            </View>
            <View>
              <Text variant="titleMedium">{item.title}</Text>
              <Text variant="bodyMedium">{item.value}</Text>
            </View>
          </Card.Content>
          {index < infoData.length - 1 && (
            <Divider style={{ marginVertical: 12 }} />
          )}
        </Fragment>
      ))}
    </Card>
  )
};

const styles = StyleSheet.create({
  card: {
    marginTop: 20,
    paddingVertical: 20,
    width: '100%',
  },
  cardContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#e2e1e1',
    justifyContent: 'center',
    alignItems: 'center',
  },
});
