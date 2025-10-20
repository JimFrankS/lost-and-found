import { Feather } from "@expo/vector-icons";
import React from "react";
import { Text, View } from "react-native";

const NothingFound = () => {
    return(
        <View className="flex-1 items-center justify-center px-8" style={{minHeight: 400}}>
            <View className="items-center">
                <Feather name="frown" size={80} color="red"/>
                <Text className="text-2xl font-bold text-gray-900 mt-6 mb-3.5">Nothing found...</Text>
                <Text className="text-center text-gray-600 text-base leading-6 max-w-xs">We couldn't find any results matching your search. Please try different keywords or check back later.</Text>
            </View>
        </View>
    );
};

export default NothingFound;