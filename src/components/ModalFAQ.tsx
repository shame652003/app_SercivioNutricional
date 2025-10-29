import React, { useState, useEffect, useRef } from 'react';
import { 
  Modal, 
  View, 
  Text, 
  ScrollView, 
  StyleSheet, 
  TouchableOpacity, 
  LayoutAnimation, 
  Platform, 
  UIManager,
  Image,
  ImageSourcePropType,
  Animated,
  Easing,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons'; 
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

const COLORS = {
  primary: '#0066CC',
  secondary: '#3399FF',
  dark: '#003366',
  background: '#f8f9fa',
  white: '#FFFFFF',
  border: '#92d7ff2f',
  backdropTransparent: 'rgba(0, 0, 0, 0)',
  backdropOpaque: 'rgba(0, 0, 0, 0.47)',
};

interface FAQItem {
  pregunta: string;
  respuesta: string;
  imagenUri?: ImageSourcePropType; 
}

interface ModalFAQProps {
  visible: boolean;
  onClose: () => void;
  tituloModulo: string;
  icono?: string;
  faqs: FAQItem[];
}

const FAQItemComponent = ({ pregunta, respuesta, imagenUri }: FAQItem) => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleOpen = () => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setIsOpen(!isOpen);
  };

  return (
    <View style={[styles.faqItem, isOpen && styles.faqItemOpen]}>
      <TouchableOpacity 
        onPress={toggleOpen} 
        style={[styles.preguntaContainer, isOpen && styles.preguntaContainerOpen]}
        activeOpacity={0.8}
      >
        <Text style={[styles.pregunta, isOpen && styles.preguntaOpen]}>{pregunta}</Text>
        <Icon 
          name={isOpen ? "chevron-up" : "chevron-down"} 
          size={24} 
          color={isOpen ? COLORS.white : COLORS.primary} 
        />
      </TouchableOpacity>

      {isOpen && (
        <View style={styles.respuestaContainer}>
          <Text style={styles.respuesta}>{respuesta}</Text>
          {imagenUri && (
            <Image 
              source={imagenUri} 
              style={styles.faqImage} 
              resizeMode="contain" 
            />
          )}
        </View>
      )}
    </View>
  );
};

export default function ModalFAQ({ visible, onClose, tituloModulo, faqs, icono }: ModalFAQProps) {
  const animatedOpacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (visible) {
      Animated.timing(animatedOpacity, {
        toValue: 1,
        duration: 350,
        easing: Easing.ease,
        useNativeDriver: true,
      }).start();
    } else {
      Animated.timing(animatedOpacity, {
        toValue: 0,
        duration: 250, 
        easing: Easing.ease,
        useNativeDriver: true,
      }).start();
    }
  }, [visible, animatedOpacity]);
  
  const backdropColor = animatedOpacity.interpolate({
    inputRange: [0, 1],
    outputRange: [COLORS.backdropTransparent, COLORS.backdropOpaque],
  });

  return (
    <Modal
      animationType="slide" 
      transparent={true}
      visible={visible}
      onRequestClose={onClose}
    >
      <Animated.View style={[styles.centeredView, { backgroundColor: backdropColor }]}>
        <View style={styles.modalView}>
          
          <View style={styles.header}>
            <MaterialCommunityIcons name={icono} size={45} color={COLORS.white} style={styles.headerIcon} />
            <Text style={styles.headerTitle}>{tituloModulo} </Text>
            <TouchableOpacity onPress={onClose} style={styles.closeButton}>
              <Icon name="close" size={30} color={COLORS.white} />
            </TouchableOpacity>
          </View>
          
          <ScrollView contentContainerStyle={styles.faqContainer}>
            {faqs.length > 0 ? (
              faqs.map((item, index) => (
                <FAQItemComponent 
                  key={index} 
                  pregunta={item.pregunta} 
                  respuesta={item.respuesta} 
                  imagenUri={item.imagenUri}
                />
              ))
            ) : (
              <Text style={styles.noFaqs}>
                {`No hay preguntas frecuentes disponibles para ${tituloModulo}.`}
              </Text>
            )}
          </ScrollView>

        </View>
      </Animated.View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: 'flex-end', 
  },
  modalView: {
    backgroundColor: COLORS.background,
    width: '100%', 
    height: '75%', 
    borderTopLeftRadius: 25,
    borderTopRightRadius: 25,
    shadowColor: COLORS.dark,
    shadowOffset: { width: 0, height: -3 }, 
    shadowOpacity: 0.25,
    shadowRadius: 10,
    elevation: 8,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 15,
    backgroundColor: COLORS.primary, 
    borderTopLeftRadius: 25,
    borderTopRightRadius: 25,
  },
  headerIcon: {
    marginRight: 10,
  },
  headerTitle: {
    flex: 1,
    fontSize: 20,
    fontWeight: '700',
    color: COLORS.white, 
  },
  closeButton: {
    padding: 5,
  },
  faqContainer: {
    padding: 20,
  },
  faqItem: {
    marginBottom: 10,
    borderRadius: 10,
    backgroundColor: COLORS.white,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 3,
    elevation: 2,
    borderLeftWidth: 5,
    borderLeftColor: 'transparent',
  },
  faqItemOpen: {
    borderLeftColor: COLORS.secondary,
    shadowOpacity: 0.15,
    elevation: 4,
  },
  preguntaContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 15,
    backgroundColor: COLORS.white,
  },
  preguntaContainerOpen: {
    backgroundColor: COLORS.secondary,
  },
  pregunta: {
    flex: 1,
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.primary,
  },
  preguntaOpen: {
    color: COLORS.white,
  },
  respuestaContainer: {
    paddingHorizontal: 15,
    paddingVertical: 15,
    backgroundColor: COLORS.background,
  },
  respuesta: {
    fontSize: 14,
    color: '#444',
    lineHeight: 22,
  },
  faqImage: {
    width: '100%',
    height: 300,
    borderRadius: 8,
    marginTop: 15,
    backgroundColor: COLORS.border,
  },
  noFaqs: {
    textAlign: 'center',
    color: '#888',
    marginTop: 30,
    paddingHorizontal: 20,
    fontSize: 16,
  }
});