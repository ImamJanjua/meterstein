import {
    Body,
    Container,
    Head,
    Heading,
    Hr,
    Html,
    Img,
    Preview,
    Section,
    Tailwind,
    Text,
} from '@react-email/components';

interface FormEmailProps {
    senderName: string;
    type: string;
    data: Record<string, any>;
}

// Helper function to format field names
const formatFieldName = (key: string): string => {
    return key
        .replace(/([A-Z])/g, ' $1')
        .replace(/^./, (str) => str.toUpperCase())
        .trim();
};

// Helper function to format field values
const formatFieldValue = (value: any): string => {
    if (value === null || value === undefined) return 'N/A';
    if (typeof value === 'object') return JSON.stringify(value, null, 2);
    return String(value);
};

export const FormEmail = ({
    senderName,
    type,
    data,
}: FormEmailProps) => {
    const previewText = `${senderName}: ${type}`;

    return (
        <Html>
            <Head />
            <Preview>{previewText}</Preview>
            <Tailwind>
                <Body className="mx-auto my-auto bg-white px-2 font-sans">
                    <Container className="mx-auto my-[40px] max-w-[600px] rounded border border-[#eaeaea] border-solid p-[20px]">
                        <Heading className="mx-0 my-[30px] p-0 text-center font-normal text-[24px] text-black">
                            {type}
                        </Heading>

                        <Section className="mt-[20px]">
                            <Text className="text-[16px] font-semibold text-black leading-[24px] mb-[10px]">
                                Von: {senderName}
                            </Text>
                        </Section>

                        <Hr className="mx-0 my-[20px] w-full border border-[#eaeaea] border-solid" />

                        {Object.entries(data).map(([key, value]) => (
                            <Section key={key} className="mt-[15px]">
                                <Text className="text-[14px] font-semibold text-black leading-[24px] mb-[5px]">
                                    {formatFieldName(key)}:
                                </Text>
                                <Text className="text-[14px] text-black leading-[24px] bg-gray-50 p-[10px] rounded">
                                    {formatFieldValue(value)}
                                </Text>
                            </Section>
                        ))}


                        <Hr className="mx-0 my-[26px] w-full border border-[#eaeaea] border-solid" />
                        <Text className="text-[#666666] text-[12px] leading-[24px]">
                            Diese Nachricht wurde über die Meterstein App gesendet.
                        </Text>
                    </Container>
                </Body>
            </Tailwind>
        </Html>
    );
};

FormEmail.PreviewProps = {
    senderName: 'Reklamation Form',
    type: 'Reklamation',
    data: {
        KundenName: 'Max Mustermann',
        WasIstKaputt: 'Das Glas der Markise ist gesprungen',
        WerIstVerantwortlich: 'Meterstein',
        WasIstPassiert: 'Nach der Montage wurde das Glas beschädigt',
    },
} as FormEmailProps;

export default FormEmail;
