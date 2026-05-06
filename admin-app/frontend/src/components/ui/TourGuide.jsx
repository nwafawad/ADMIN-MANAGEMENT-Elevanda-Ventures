import Joyride, { STATUS } from 'react-joyride';
import { useState, useEffect } from 'react';

export default function TourGuide() {
  const [run, setRun] = useState(false);

  // We only run the tour if the user hasn't seen it yet (tracked via localStorage)
  useEffect(() => {
    const hasSeenTour = localStorage.getItem('elevanda_admin_tour_completed');
    if (!hasSeenTour) {
      // Delay the tour slightly so the page fully renders and animations complete
      const timer = setTimeout(() => setRun(true), 1500);
      return () => clearTimeout(timer);
    }
  }, []);

  const steps = [
    {
      target: 'body',
      placement: 'center',
      title: 'Welcome to the Admin Portal! 🎉',
      content: 'This guided tour will help you understand how to navigate and manage the Elevanda School System.',
    },
    {
      target: '#sidebar-dashboard',
      content: "Here you can see a high-level overview of the school's performance, attendance rates, and recent activity.",
      placement: 'right',
    },
    {
      target: '#sidebar-users',
      content: 'Manage all students, parents, and teachers here. You can also verify new device logins from this menu.',
      placement: 'right',
    },
    {
      target: '#sidebar-fees',
      content: 'Track financial health, approve fee deposits, and monitor withdrawals here.',
      placement: 'right',
    },
    {
      target: '#sidebar-classes',
      content: 'Manage class structures, assign teachers to classes, and view student rosters.',
      placement: 'right',
    },
    {
      target: '#sidebar-academics',
      content: 'Record grades, update daily attendance, and print report cards from the academics module.',
      placement: 'right',
    },
    {
      target: '#navbar-profile',
      content: 'Access your admin profile and logout securely here.',
      placement: 'bottom',
    }
  ];

  const handleJoyrideCallback = (data) => {
    const { status } = data;
    const finishedStatuses = [STATUS.FINISHED, STATUS.SKIPPED];

    if (finishedStatuses.includes(status)) {
      setRun(false);
      localStorage.setItem('elevanda_admin_tour_completed', 'true');
    }
  };

  return (
    <Joyride
      steps={steps}
      run={run}
      continuous
      scrollToFirstStep
      showProgress
      showSkipButton
      callback={handleJoyrideCallback}
      styles={{
        options: {
          primaryColor: '#6366f1', // primary-500
          zIndex: 10000,
          arrowColor: '#fff',
          backgroundColor: '#fff',
          textColor: '#1f2937',
        },
        tooltip: {
          borderRadius: '12px',
          boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1)',
        },
        buttonNext: {
          backgroundColor: '#6366f1',
          borderRadius: '8px',
          padding: '8px 16px',
        },
        buttonBack: {
          color: '#6b7280',
        },
        buttonSkip: {
          color: '#9ca3af',
        }
      }}
    />
  );
}
