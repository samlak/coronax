const aboutInfo = (bot, msg) => {
    const about = (fullName, content, shortName, url) => {
        bot.sendMessage(
            msg.chat.id,
            `*Coronavirus (COVID-19) according to ${fullName}* \n${content}`,
            {
                "reply_markup": {
                    "inline_keyboard": [
                        [{text: "Read More at "+ shortName, url: url}],
                        [{text: "Wikipedia Defination", callback_data: 'wikipedia'}],
                        [{text: "Mayoclinic Defination", callback_data: 'mayoclinic'}],
                        [{text: "WHO Defination", callback_data: 'WHO'}],
                    ]
                },
                parse_mode: "Markdown"
            }
        );
    }

    bot.on("callback_query", function(data){
        if(data.data == "wikipedia"){
            return about(
                "Wikipedia",
                "Coronaviruses are a group of related viruses that cause diseases in mammals and birds. In humans, coronaviruses cause respiratory tract infections that are typically mild, such as "+
                "some cases of the common cold (among other possible causes, predominantly rhinoviruses), though rarer forms can be lethal, such as SARS, MERS, and COVID-19. Symptoms in other species " + 
                "vary: in chickens, they cause an upper respiratory tract disease, while in cows and pigs they cause diarrhea. There are yet to be vaccines or antiviral drugs to prevent or treat human " + 
                "coronavirus infections."+
                "Coronaviruses constitute the subfamily Orthocoronavirinae, in the family Coronaviridae, order Nidovirales, and realm Riboviria. They are enveloped viruses with a positive-sense " +
                "single-stranded RNA genome and a nucleocapsid of helical symmetry. The genome size of coronaviruses ranges from approximately 27 to 34 kilobases, the largest among known RNA viruses. " +
                "The name coronavirus is derived from the Latin corona, meaning \"crown\" or \"halo\", which refers to the characteristic appearance reminiscent of a crown or a solar corona around the " +
                "virions (virus particles) when viewed under two-dimensional transmission electron microscopy, due to the surface covering in club-shaped protein spikes.",
                "Wikipedia",
                "https://en.wikipedia.org/wiki/Coronavirus"
            );
        }else if(data.data == "mayoclinic"){
            return about(
                "Mayoclinic",
                "A new virus called the severe acute respiratory syndrome coronavirus 2 (SARS-CoV-2) has been identified as the cause of a disease outbreak that began in China. The disease is called " + 
                "coronavirus disease 2019 (COVID-19). The virus is a type of coronavirus — a family of viruses that can cause illnesses such as the common cold, severe acute respiratory syndrome (SARS) " +
                "and Middle East respiratory syndrome (MERS). Because this virus is so new, not much is known about it yet. Public health groups, such as the World Health Organization (WHO) and the U.S. " +
                "Centers for Disease Control and Prevention (CDC), are investigating. Check their websites for updates. " +
                "\nThe new coronavirus appears to be spreading from person to person. It may be spread by respiratory droplets when someone infected with the virus coughs or sneezes. It's unclear exactly " + 
                "how contagious the virus is.",
                "Mayoclinic",
                "https://www.mayoclinic.org/diseases-conditions/coronavirus/expert-answers/novel-coronavirus/faq-20478727"
            );
        }else if(data.data == "WHO"){
            return about(
                "WHO (World Health Organization)",
                "Coronaviruses (CoV) are a large family of viruses that cause illness ranging from the common cold to more severe diseases such as Middle East Respiratory Syndrome " +
                "(MERS-CoV) and Severe Acute Respiratory Syndrome (SARS-CoV). Coronavirus disease (COVID-19) is a new strain that was discovered in 2019 and has not been previously identified in humans. " +
                "\nCoronaviruses are zoonotic, meaning they are transmitted between animals and people.  Detailed investigations found that SARS-CoV was transmitted from civet cats to humans and "+ 
                "MERS-CoV from dromedary camels to humans. Several known coronaviruses are circulating in animals that have not yet infected humans. ",
                "WHO",
                "https://www.who.int/health-topics/coronavirus"
            );
        }
    });

    return about(
        "WHO (World Health Organization)",
        "Coronaviruses (CoV) are a large family of viruses that cause illness ranging from the common cold to more severe diseases such as Middle East Respiratory Syndrome " +
        "(MERS-CoV) and Severe Acute Respiratory Syndrome (SARS-CoV). Coronavirus disease (COVID-19) is a new strain that was discovered in 2019 and has not been previously identified in humans. " +
        "\nCoronaviruses are zoonotic, meaning they are transmitted between animals and people.  Detailed investigations found that SARS-CoV was transmitted from civet cats to humans and "+ 
        "MERS-CoV from dromedary camels to humans. Several known coronaviruses are circulating in animals that have not yet infected humans. ",
        "WHO",
        "https://www.who.int/health-topics/coronavirus"
    );
}

const symptom = (bot, msg) => {
    bot.sendMessage(
        msg.chat.id,
        "Symptom of coronavirus (COVID-19) according to *WHO (World Health Organization)*" +
        "\nThe most common symptoms of COVID-19 are fever, tiredness, and dry cough. Some patients may have aches and pains, nasal congestion, runny nose, sore throat or diarrhea. These symptoms " + 
        "are usually mild and begin gradually. Some people become infected but don’t develop any symptoms and don't feel unwell. Most people (about 80%) recover from the disease without needing " + 
        "special treatment. Around 1 out of every 6 people who gets COVID-19 becomes seriously ill and develops difficulty breathing. Older people, and those with underlying medical problems like " +
        "high blood pressure, heart problems or diabetes, are more likely to develop serious illness. People with fever, cough and difficulty breathing should seek medical attention."
        ,
        {
            "reply_markup": {
                "inline_keyboard": [
                    [{text: "Source: WHO (World Health Organization)", url: "https://www.who.int/news-room/q-a-detail/q-a-coronaviruses"}],
                ]
            },
            parse_mode: "Markdown"
        }
    );
}

const prevent = (bot, msg) => {
    bot.sendMessage(
        msg.chat.id,
        "How to protect against coronavirus (COVID-19) according to *WHO (World Health Organization)*"+

        "\n\n*Protection measures for everyone*"+

        "\n\nYou can reduce your chances of being infected or spreading COVID-19 by taking some simple precautions:"+
        "\n> Regularly and thoroughly clean your hands with an alcohol-based hand rub or wash them with soap and water."+
        "\nWhy? Washing your hands with soap and water or using alcohol-based hand rub kills viruses that may be on your hands."+
        "\n> Maintain at least 1 metre (3 feet) distance between yourself and anyone who is coughing or sneezing."+
        "\nWhy? When someone coughs or sneezes they spray small liquid droplets from their nose or mouth which may contain virus. If you are too close, you can breathe in the droplets, including "+
        "the COVID-19 virus if the person coughing has the disease."+
        "\n> Avoid touching eyes, nose and mouth."+
        "\nWhy? Hands touch many surfaces and can pick up viruses. Once contaminated, hands can transfer the virus to your eyes, nose or mouth. From there, the virus can enter your "+
        "body and can make you sick."+
        "\n> Make sure you, and the people around you, follow good respiratory hygiene. This means covering your mouth and nose with your bent elbow or tissue when you cough or sneeze. "+
        "Then dispose of the used tissue immediately."+
        "\nWhy? Droplets spread virus. By following good respiratory hygiene you protect the people around you from viruses such as cold, flu and COVID-19."+
        "\n> Stay home if you feel unwell. If you have a fever, cough and difficulty breathing, seek medical attention and call in advance. Follow the directions of your local health authority."+
        "\nWhy? National and local authorities will have the most up to date information on the situation in your area. Calling in advance will allow your health care provider to quickly direct you "+
        "to the right health facility. This will also protect you and help prevent spread of viruses and other infections."+
        "\n> Keep up to date on the latest COVID-19 hotspots (cities or local areas where COVID-19 is spreading widely). If possible, avoid traveling to places  – especially "+
        "if you are an older person or have diabetes, heart or lung disease."+
        "\nWhy? You have a higher chance of catching COVID-19 in one of these areas."+
         
        "\n\n*Protection measures for persons who are in or have recently visited (past 14 days) areas where COVID-19 is spreading*"+

        "\n\n> Follow the guidance outlined above (Protection measures for everyone)"+
        "\n> Self-isolate by staying at home if you begin to feel unwell, even with mild symptoms such as headache, low grade fever (37.3 C or above) and slight runny nose, "+
        "until you recover. If it is essential for you to have someone bring you supplies or to go out, e.g. to buy food, then wear a mask to avoid infecting other people."+
        "\nWhy? Avoiding contact with others and visits to medical facilities will allow these facilities to operate more effectively and help protect you and others from "+
        "possible COVID-19 and other viruses."+
        "\n> If you develop fever, cough and difficulty breathing, seek medical advice promptly as this may be due to a respiratory infection or other serious condition. "+
        "Call in advance and tell your provider of any recent travel or contact with travelers."+
        "\nWhy? Calling in advance will allow your health care provider to quickly direct you to the right health facility. This will also help to prevent possible spread of COVID-19 and other viruses."
        ,
        {
            "reply_markup": {
                "inline_keyboard": [
                    [{text: "Source: WHO (World Health Organization)", url: "https://www.who.int/news-room/q-a-detail/q-a-coronaviruses"}],
                ]
            },
            parse_mode: "Markdown"
        }
    );
}

const contribute = (bot, msg) => {
    bot.sendMessage(
        msg.chat.id,
        `Do have anything that you wants to add to this bot to make it better. \nYou can contact @devsamlak to submit your feedback. \nYou can also fork my code on github.`,
        {
            "reply_markup": {
                "inline_keyboard": [
                    [{text: "Fork my code on Github", url: 'http://github.com/samlak/coronax'}]
                ]
            },
            parse_mode: "Markdown"
        }
    );
}

const credit = (bot, msg) => {
    bot.sendMessage(
        msg.chat.id,
        `I will like to appreciate the following for providing data that drive this bot: \n[inline URL](http://www.example.com/)`,
        {parse_mode: "Markdown"}
    );
}

module.exports = {aboutInfo, symptom, prevent, contribute, credit};