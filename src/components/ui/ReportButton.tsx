import { useState } from 'react';
import { pdf } from '@react-pdf/renderer';
import { MeetingFormApiData } from '../../types/meeting';
import { MeetingReport } from '../pdf/MeetingReport';

interface ReportButtonProps {
  meeting: MeetingFormApiData;
}

export function ReportButton({ meeting }: ReportButtonProps) {
  const [isGenerating, setIsGenerating] = useState(false);

  const generatePDF = async () => {
    setIsGenerating(true);
    console.log(meeting);
    try {
      const blob = await pdf(<MeetingReport meeting={meeting} />).toBlob();
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `reuniao-${meeting.id}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Error generating PDF:', error);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <button
      onClick={generatePDF}
      disabled={isGenerating}
      className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
    >
      {isGenerating ? 'Gerando relatório...' : 'Gerar relatório'}
    </button>
  );
}