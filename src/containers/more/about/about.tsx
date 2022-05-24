import React, { useEffect, useState } from "react";
import { View, useWindowDimensions, Pressable, ScrollView } from "react-native";
import { useTheme } from "@react-navigation/native";
import { openURL } from "expo-linking";
import { DataSourcesProps } from "../../types";
import { Divider, Button, IconButton } from 'react-native-paper';
import { VERSION } from "../../../constants";
import FastImage from "react-native-fast-image";
import { Release } from "../../../Api/github/types";
import { fetchRelease } from "../../../Api/github/github";
import { getLastUpdateCheck, setLastUpdateCheck } from "../../../Storage/updates";
import DownloadDialog from "../../../Components/dialogs/downloadDialog";
import { AboutHeaderButton, AllLinksButton, CheckUpdateButton, KofiButton, MediaLinks, NewVersionBanner, ShowDataSources, VersionButton, WhatsNewButton } from "./components/buttons";

const About = ({navigation}:DataSourcesProps) => {
    const [release, setRelease] = useState<Release>();
    const [visible, setVisible] = useState(false);
    const [loading, setLoading] = useState<boolean>(false);
    const [lastChecked, setLastChecked] = useState<string>();
    const { colors, dark } = useTheme();
    const { width, height } = useWindowDimensions();

    const openDialog = () => setVisible(true);
    const closeDialog = () => setVisible(false);

    const checkForUpdates = async () => {
        setLoading(true);
        const latest = await fetchRelease(); 
        const date = new Date().toLocaleString();
        await setLastUpdateCheck(date);
        setLastChecked(date);
        setLoading(false);
        setRelease(latest);
        if (latest.tag_name !== VERSION) {
            openDialog();
        }
    }

    useEffect(() => {
        getLastUpdateCheck().then((time) => setLastChecked(time));
    },[]);

    return (
        <ScrollView style={{flex:1, backgroundColor:(dark) ? colors.background : colors.card}}>
            <AboutHeaderButton navigation={navigation} colors={colors} dark={dark} />
            <Divider style={{backgroundColor:colors.border}} />
            {(release && release?.tag_name !== VERSION) && <NewVersionBanner openDialog={openDialog} colors={colors} />}
            <VersionButton openDialog={openDialog} colors={colors} />
            {(!release || release?.tag_name === VERSION) && <CheckUpdateButton checkForUpdates={checkForUpdates} lastChecked={lastChecked} loading={loading} colors={colors} />}
            <WhatsNewButton colors={colors} />
            <ShowDataSources navigation={navigation} colors={colors} />
            <MediaLinks colors={colors} />
            <AllLinksButton colors={colors} />
            <KofiButton colors={colors} />
            <DownloadDialog colors={colors} visible={visible} onDismiss={closeDialog} release={release} />
        </ScrollView>
    );
}

export default About;