/**
 * Utility functions for handling external links
 */

export interface ExternalLink {
    id: string;
    title: string;
    url: string;
    description?: string;
}

/**
 * Opens an external URL in a new tab/window
 * @param url - The URL to open
 * @param fallbackMessage - Optional message to show if opening fails
 */
export const openExternalLink = async (url: string, fallbackMessage?: string): Promise<void> => {
    try {
        // Check if we're in a browser environment
        if (typeof window !== 'undefined' && window.open) {
            const newWindow = window.open(url, '_blank', 'noopener,noreferrer');

            // Check if popup was blocked
            if (!newWindow || newWindow.closed || typeof newWindow.closed === 'undefined') {
                throw new Error('Popup blocked');
            }
        } else {
            throw new Error('Window not available');
        }
    } catch (error) {
        console.error('Failed to open external link:', error);

        // Fallback: try to create a temporary link and click it
        if (typeof window !== 'undefined' && document) {
            try {
                const link = document.createElement('a');
                link.href = url;
                link.target = '_blank';
                link.rel = 'noopener noreferrer';
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
            } catch (fallbackError) {
                console.error('Fallback method failed:', fallbackError);
                // If all else fails, show an error message
                alert(fallbackMessage || `Could not open: ${url}`);
            }
        } else {
            // If all else fails, show an error message
            alert(fallbackMessage || `Could not open: ${url}`);
        }
    }
};

/**
 * External links configuration
 */
export const EXTERNAL_LINKS: Record<string, ExternalLink> = {
    // Abnahme
    abnahme: {
        id: 'abnahme',
        title: 'Abnahmeprotokoll',
        url: 'https://www.meterstein.de/abnahmeprotokoll/',
        description: 'Abnahmeprotokoll öffnen'
    },

    // Kalendar
    kalendar: {
        id: 'kalendar',
        title: 'Kalender',
        url: 'https://calendar.google.com/calendar/u/0/r',
        description: 'Google Kalender öffnen'
    },

    // Hilfe - PDFs
    statikanfrage: {
        id: 'statikanfrage',
        title: 'Statikanfrage',
        url: 'https://www.meterstein.de/app/montageanleitungen/statikanfrage-meterstein.pdf',
        description: 'Statikanfrage PDF öffnen'
    },

    reklamationsformular: {
        id: 'reklamationsformular',
        title: 'Reklamationsformular',
        url: 'https://www.meterstein.de/app/montageanleitungen/Reklamationsformular.pdf',
        description: 'Reklamationsformular PDF öffnen'
    },

    baugenehmigung: {
        id: 'baugenehmigung',
        title: 'Baugenehmigung',
        url: 'https://www.meterstein.de/app/montageanleitungen/baugenehmigung_antrag.pdf',
        description: 'Baugenehmigung PDF öffnen'
    },

    glasrichtlinien: {
        id: 'glasrichtlinien',
        title: 'Glasrichtlinien',
        url: 'https://www.meterstein.de/app/montageanleitungen/glasrichtlinien.pdf',
        description: 'Glasrichtlinien PDF öffnen'
    },

    gewichtsermittlung: {
        id: 'gewichtsermittlung',
        title: 'Gewichtsermittlung',
        url: 'https://www.meterstein.de/app/montageanleitungen/Gewichtsermittlung.pdf',
        description: 'Gewichtsermittlung PDF öffnen'
    },

    zugband_wechseln: {
        id: 'zugband_wechseln',
        title: 'Zugband wechseln',
        url: 'https://www.meterstein.de/app/montageanleitungen/t200_zugbandwechsel.pdf',
        description: 'Zugband wechseln PDF öffnen'
    },

    motor_einlernen: {
        id: 'motor_einlernen',
        title: 'Motor einlernen',
        url: 'https://www.meterstein.de/app/Selt/6channel-RC-Fernbedienung.pdf',
        description: 'Motor einlernen PDF öffnen'
    },

    led_einlernen: {
        id: 'led_einlernen',
        title: 'LED einlernen',
        url: 'https://www.meterstein.de/app/Selt/LED-wLight-datenblatt.pdf',
        description: 'LED einlernen PDF öffnen'
    },

    einstellungen_wt_motor: {
        id: 'einstellungen_wt_motor',
        title: 'Einstellungen WT Motor',
        url: 'https://www.meterstein.de/app/montageanleitungen/SOMFY-Orea-WT-mit-Einstellkabel.pdf',
        description: 'Einstellungen WT Motor PDF öffnen'
    },

    // Montageanleitungen
    t200: {
        id: 't200',
        title: 'T200',
        url: 'https://www.meterstein.de/app/montageanleitungen/t200_einteilig_unterglas.pdf',
        description: 'T200 Montageanleitung PDF öffnen'
    },

    t200_mehrteilig: {
        id: 't200_mehrteilig',
        title: 'T200 Mehrteilig',
        url: 'https://www.meterstein.de/app/montageanleitungen/montageanleitung-t200-mehrteilig.pdf',
        description: 'T200 Mehrteilig Montageanleitung PDF öffnen'
    },

    toskana: {
        id: 'toskana',
        title: 'Toskana',
        url: 'https://www.meterstein.de/app/montageanleitungen/montageanleitung-toscana.pdf',
        description: 'Toskana Montageanleitung PDF öffnen'
    },

    tarasola_tende: {
        id: 'tarasola_tende',
        title: 'Tarasola Tende',
        url: 'https://www.meterstein.de/app/montageanleitungen/Lamellendach_tara-tende.pdf',
        description: 'Tarasola Tende Montageanleitung PDF öffnen'
    },

    unter_aufdach: {
        id: 'unter_aufdach',
        title: 'Unter Aufdach',
        url: 'https://meterstein.de/tuchkollektion.pdf',
        description: 'Unter Aufdach PDF öffnen'
    },

    senkrecht: {
        id: 'senkrecht',
        title: 'Senkrecht',
        url: 'https://meterstein.de/starscreen.pdf',
        description: 'Senkrecht PDF öffnen'
    },

    seilspannmarkisen: {
        id: 'seilspannmarkisen',
        title: 'Seilspannmarkisen',
        url: 'https://www.meterstein.de/app/montageanleitungen/Seilspannmarkisen.pdf',
        description: 'Seilspannmarkisen PDF öffnen'
    },

    sb1400: {
        id: 'sb1400',
        title: 'SB1400',
        url: 'https://www.meterstein.de/app/montageanleitungen/montageanleitung-sb1400.pdf',
        description: 'SB1400 Montageanleitung PDF öffnen'
    },

    kastenmarkisen: {
        id: 'kastenmarkisen',
        title: 'Kastenmarkisen',
        url: 'https://www.meterstein.de/app/montageanleitungen/k100.pdf',
        description: 'Kastenmarkisen PDF öffnen'
    },

    aufdachmarkise: {
        id: 'aufdachmarkise',
        title: 'Aufdachmarkise',
        url: 'https://www.meterstein.de/app/montageanleitungen/w350_mit_zip.pdf',
        description: 'Aufdachmarkise PDF öffnen'
    },

    dreieck_festelement: {
        id: 'dreieck_festelement',
        title: 'Dreieck Festelement',
        url: 'https://www.meterstein.de/app/montageanleitungen/anleitung-selbstbau-fenster.pdf',
        description: 'Dreieck Festelement PDF öffnen'
    },

    // Cube Line
    cube_line_style: {
        id: 'cube_line_style',
        title: 'Cube Line Style',
        url: 'https://www.meterstein.de/app/montageanleitungen/montageanleitung-Cube-Line-style.pdf',
        description: 'Cube Line Style Montageanleitung PDF öffnen'
    },

    cube_line_compact: {
        id: 'cube_line_compact',
        title: 'Cube Line Compact',
        url: 'https://www.meterstein.de/app/montageanleitungen/montageanleitung-Cube-Line-compact.pdf',
        description: 'Cube Line Compact Montageanleitung PDF öffnen'
    },

    cube_line_classic: {
        id: 'cube_line_classic',
        title: 'Cube Line Classic',
        url: 'https://www.meterstein.de/app/montageanleitungen/montageanleitung-Cube-Line-classic.pdf',
        description: 'Cube Line Classic Montageanleitung PDF öffnen'
    },

    classic_prime_line: {
        id: 'classic_prime_line',
        title: 'Classic Prime Line',
        url: 'https://www.meterstein.de/app/montageanleitungen/montageanleitung-Classic-Prime.pdf',
        description: 'Classic Prime Line Montageanleitung PDF öffnen'
    },

    cabrio_line: {
        id: 'cabrio_line',
        title: 'Cabrio Line',
        url: 'https://www.meterstein.de/app/montageanleitungen/montageanleitung-Cabrio-Line-compact.pdf',
        description: 'Cabrio Line Montageanleitung PDF öffnen'
    },
    fundamentplan: {
        id: 'fundamentplan',
        title: 'Fundamentplan',
        url: 'https://rqlesxlohtlfgwjtpqoh.supabase.co/storage/v1/object/public/hilfe-assets/fundamentplan.webp',
        description: 'Fundamentplan Bild öffnen'
    },

    // Aliases for hyphenated IDs used in hilfe screen
    'motor-einlernen': {
        id: 'motor-einlernen',
        title: 'Motor einlernen',
        url: 'https://www.meterstein.de/app/Selt/6channel-RC-Fernbedienung.pdf',
        description: 'Motor einlernen PDF öffnen'
    },

    'led-einlernen': {
        id: 'led-einlernen',
        title: 'LED einlernen',
        url: 'https://www.meterstein.de/app/Selt/LED-wLight-datenblatt.pdf',
        description: 'LED einlernen PDF öffnen'
    },

    'einstellungen-wt-motor': {
        id: 'einstellungen-wt-motor',
        title: 'Einstellungen WT Motor',
        url: 'https://www.meterstein.de/app/montageanleitungen/SOMFY-Orea-WT-mit-Einstellkabel.pdf',
        description: 'Einstellungen WT Motor PDF öffnen'
    },

    't200-mehrteilig': {
        id: 't200-mehrteilig',
        title: 'T200 Mehrteilig',
        url: 'https://www.meterstein.de/app/montageanleitungen/montageanleitung-t200-mehrteilig.pdf',
        description: 'T200 Mehrteilig Montageanleitung PDF öffnen'
    },

    'tarasola-tende': {
        id: 'tarasola-tende',
        title: 'Tarasola Tende',
        url: 'https://www.meterstein.de/app/montageanleitungen/Lamellendach_tara-tende.pdf',
        description: 'Tarasola Tende Montageanleitung PDF öffnen'
    },

    'unter-aufdach': {
        id: 'unter-aufdach',
        title: 'Unter Aufdach',
        url: 'https://meterstein.de/tuchkollektion.pdf',
        description: 'Unter Aufdach PDF öffnen'
    },


    'cube-line-style': {
        id: 'cube-line-style',
        title: 'Cube Line Style',
        url: 'https://www.meterstein.de/app/montageanleitungen/montageanleitung-Cube-Line-style.pdf',
        description: 'Cube Line Style Montageanleitung PDF öffnen'
    },

    'cube-line-compact': {
        id: 'cube-line-compact',
        title: 'Cube Line Compact',
        url: 'https://www.meterstein.de/app/montageanleitungen/montageanleitung-Cube-Line-compact.pdf',
        description: 'Cube Line Compact Montageanleitung PDF öffnen'
    },

    'cube-line-classic': {
        id: 'cube-line-classic',
        title: 'Cube Line Classic',
        url: 'https://www.meterstein.de/app/montageanleitungen/montageanleitung-Cube-Line-classic.pdf',
        description: 'Cube Line Classic Montageanleitung PDF öffnen'
    },

    'classic-prime-line': {
        id: 'classic-prime-line',
        title: 'Classic Prime Line',
        url: 'https://www.meterstein.de/app/montageanleitungen/montageanleitung-Classic-Prime.pdf',
        description: 'Classic Prime Line Montageanleitung PDF öffnen'
    },

    'cabrio-line': {
        id: 'cabrio-line',
        title: 'Cabrio Line',
        url: 'https://www.meterstein.de/app/montageanleitungen/montageanleitung-Cabrio-Line-compact.pdf',
        description: 'Cabrio Line Montageanleitung PDF öffnen'
    },

    'dreieck-festelement': {
        id: 'dreieck-festelement',
        title: 'Dreieck Festelement',
        url: 'https://www.meterstein.de/app/montageanleitungen/anleitung-selbstbau-fenster.pdf',
        description: 'Dreieck Festelement PDF öffnen'
    },

    'zugband-wechseln': {
        id: 'zugband-wechseln',
        title: 'Zugband wechseln',
        url: 'https://www.meterstein.de/app/montageanleitungen/t200_zugbandwechsel.pdf',
        description: 'Zugband wechseln PDF öffnen'
    }
};

/**
 * Get external link by ID
 */
export const getExternalLink = (id: string): ExternalLink | undefined => {
    return EXTERNAL_LINKS[id];
};

/**
 * Open external link by ID
 */
export const openExternalLinkById = async (id: string): Promise<void> => {
    const link = getExternalLink(id);
    if (link) {
        await openExternalLink(link.url, `Could not open ${link.title}`);
    } else {
        console.error(`External link not found: ${id}`);
    }
};
