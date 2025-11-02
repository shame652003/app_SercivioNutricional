// --- components/ContentContainer.js ---

import {View, StyleSheet, ScrollView} from "react-native"

interface Info{
    children: React.ReactNode;
};
 
function ContentContainer(props:Info){
    return (
        // El flexGrow: 1 en el contentContainerStyle es la clave aquí.
        <ScrollView contentContainerStyle={stylesContainer.contentContainer}>{props.children}</ScrollView>
    )
}
 
export default ContentContainer;
 
const stylesContainer = StyleSheet.create({
    contentContainer: {
        flexGrow: 1, // ¡Esto es perfecto!
        justifyContent: 'flex-start',
        paddingBottom: 80, 
    },
});