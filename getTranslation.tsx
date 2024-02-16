import { useLayoutEffect, useState } from "react";
import getRedux from "../redux/getRedux";
import { MAJOR, MINOR, SAVE_TRANSLATIONS_IN_STORAGE, TRANSLATION_FILES, TRANSLATION_PATH } from "../utils/globalVariables";
import AsyncStorage from '@react-native-async-storage/async-storage';
import setRedux from "../redux/setRedux";

export default function getT(file: string){
    const lg = getRedux("locale");
    const [data, setData] = useState<any>(null);

    useLayoutEffect(() => {
        async function load(){
            const stored = await AsyncStorage.getItem(`${MAJOR}.${MINOR}/${lg}/${file}`);
            if(stored && SAVE_TRANSLATIONS_IN_STORAGE) return setData(JSON.parse(stored));
            const res = await fetch(`${TRANSLATION_PATH}/translations/${lg}/${file}.json`);
            const data = await res.json();
            await AsyncStorage.setItem(`${MAJOR}.${MINOR}/${lg}/${file}`, JSON.stringify(data));
            setData(data);
        }
        load();
    },[])

    return data

} 

export async function loadTranslations(locale: string, dispatch: any){
    const translations = {};
    const load = async () => {
        for(const file of TRANSLATION_FILES){
            const res = await fetch(`${TRANSLATION_PATH}/translations/${locale}/${file}.json`)
            const data = await res.json()
            //@ts-ignore
            translations[file] = data;
        }
    }
    await load();
    setRedux("translation", translations, dispatch)
}