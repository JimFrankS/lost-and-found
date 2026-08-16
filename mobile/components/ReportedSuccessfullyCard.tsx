import { Feather } from "@expo/vector-icons";
import React from "react";
import { Text, View } from "react-native";

const ReportedSuccessfully = ({ hookname }: { hookname: string }) => {
    return (
        <View className="flex-1 items-center justify-center px-8" style={{minHeight: 400}}>
            <View className="items-center">
                <Feather name="check-circle" size={80} color="green" />
                <Text className="text-center text-2xl font-bold text-gray-900 mt-6 mb-3.5">{hookname} Reported Successfully</Text>
            </View>
        </View>
    );
};

export default ReportedSuccessfully