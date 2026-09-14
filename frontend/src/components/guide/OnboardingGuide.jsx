import React from 'react';
import { Joyride } from 'react-joyride';
import { useGuide } from '../../context/GuideContext';

const OnboardingGuide = () => {
    const { run, steps, refreshKey, handleJoyrideCallback } = useGuide();

    // JANGAN RENDERING APAPUN jika run = false. 
    if (!run || steps.length === 0) return null;

    return (
        <Joyride
            key={`tour-${refreshKey}-${run}`}
            steps={steps}
            run={run}
            continuous={true}
            showProgress={true}
            showSkipButton={true}
            disableOverlayClose={true}
            disableScrolling={false}
            disableBeacon={true} 
            spotlightClicks={false}
            callback={handleJoyrideCallback}
            debug={false}
            floaterProps={{
                disableAnimation: true,
            }}
            locale={{
                back: 'Kembali',
                close: 'Tutup',
                last: 'Selesai',
                next: 'Lanjut',
                skip: 'Lewati',
            }}
            styles={{
                options: {
                    primaryColor: '#235347',
                    zIndex: 999999,
                },
                tooltipContainer: {
                    textAlign: 'left',
                },
                buttonNext: {
                    borderRadius: '8px',
                    padding: '10px 20px',
                }
            }}
        />
    );
};

export default OnboardingGuide;
