import { useState } from 'react';
import { Meeting } from '../types/meeting';
import { MeetingDetailsCard } from './meeting/MeetingDetailsCard';

interface TodayMeetingsProps {
  meetings: Meeting[];
}

export function TodayMeetings({ meetings }: TodayMeetingsProps) {
  if (meetings.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6 text-center">
        <p className="text-gray-600 text-lg">
          Não há reuniões agendadas para hoje.
        </p>
        <p className="text-gray-500 mt-2">
          Quando houver reuniões programadas, elas aparecerão aqui.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {meetings.map((meeting) => (
        <MeetingDetailsCard key={meeting.id} meeting={meeting} />
      ))}
    </div>
  );
}