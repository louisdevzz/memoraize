'use client';
import { useParams } from "next/navigation";
import Quiz from "@/components/Quiz";
import MatchUp from "@/components/MatchUp";
import Anagram from "@/components/Anagram";
import SpeakingCards from "@/components/SpeakingCards";
import FlashCards from "@/components/FlashCards";
import FindMatch from "@/components/FindMatch";

const CreateTemplatePage = () => {
    const params = useParams();
    const template = params.template;

    const renderTemplate = () => {
        switch (template) {
            case 'quiz':
                return <Quiz />;
            case 'match-up':
                return <MatchUp />;
            case 'anagram':
                return <Anagram />;
            case 'speaking-cards':
                return <SpeakingCards />;
            case 'flash-cards':
                return <FlashCards />;
            case 'find-match':
                return <FindMatch />;
            default:
                return <div className="flex items-center justify-center h-screen">
                    <span className="font-semibold text-2xl">Template coming soon</span>
                </div>;
        }
    };

    return renderTemplate();
};

export default CreateTemplatePage;
