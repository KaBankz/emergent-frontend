'use client';

import { AnimatePresence, motion } from 'framer-motion';
import {
  LiveKitRoom,
  useVoiceAssistant,
  BarVisualizer,
  RoomAudioRenderer,
  VoiceAssistantControlBar,
  AgentState,
  DisconnectButton,
} from '@livekit/components-react';
import { useCallback, useEffect, useState } from 'react';
import { MediaDeviceFailure } from 'livekit-client';
import type { ConnectionDetails } from '@/app/api/connection-details/route';
import { NoAgentNotification } from '@/components/NoAgentNotification';
import { CloseIcon } from '@/components/CloseIcon';
import { useKrispNoiseFilter } from '@livekit/components-react/krisp';
import { Button } from '@/components/Button';

export default function Page() {
  const [connectionDetails, updateConnectionDetails] = useState<
    ConnectionDetails | undefined
  >(undefined);
  const [agentState, setAgentState] = useState<AgentState>('disconnected');
  const [currentSimulation, setCurrentSimulation] = useState('Heart Attack');

  const onConnectButtonClicked = useCallback(async () => {
    // Generate room connection details, including:
    //   - A random Room name
    //   - A random Participant name
    //   - An Access Token to permit the participant to join the room
    //   - The URL of the LiveKit server to connect to
    //
    // In real-world application, you would likely allow the user to specify their
    // own participant name, and possibly to choose from existing rooms to join.

    const url = new URL(
      process.env.NEXT_PUBLIC_CONN_DETAILS_ENDPOINT ??
        '/api/connection-details',
      window.location.origin
    );
    const response = await fetch(url.toString());
    const connectionDetailsData = await response.json();
    updateConnectionDetails(connectionDetailsData);
  }, []);

  return (
    <main
      data-lk-theme='default'
      className='h-full grid content-center bg-[var(--lk-bg)]'
    >
      <div className='flex flex-col gap-2 items-center'>
        <span className='text-white text-6xl font-bold leading-tight'>
          Emergent
        </span>
      </div>
      <LiveKitRoom
        token={connectionDetails?.participantToken}
        serverUrl={connectionDetails?.serverUrl}
        connect={connectionDetails !== undefined}
        audio={true}
        video={false}
        onMediaDeviceFailure={onDeviceFailure}
        onDisconnected={() => {
          updateConnectionDetails(undefined);
        }}
        className='grid grid-rows-[2fr_1fr] items-center'
      >
        <SimpleVoiceAssistant onStateChange={setAgentState} />
        <ControlBar
          onConnectButtonClicked={onConnectButtonClicked}
          agentState={agentState}
        />
        <RoomAudioRenderer />

        <div className='flex flex-col gap-2 items-center'>
          <span className='text-white text-2xl font-bold flex flex-col gap-2'>
            Medical Emergencies Simulations
          </span>
          <div className='flex flex-row gap-2 justify-center'>
            <Button
              className={
                currentSimulation === 'Heart Attack'
                  ? 'bg-red-500 text-white hover:bg-red-600'
                  : ''
              }
              onClick={() => {
                fetch('/api/simulate', {
                  method: 'POST',
                  body: JSON.stringify({
                    simulation: 'heart-attack',
                  }),
                });
                setCurrentSimulation('Heart Attack');
              }}
            >
              Heart Attack
            </Button>
            <Button
              className={
                currentSimulation === 'Stroke'
                  ? 'bg-red-500 text-white hover:bg-red-600'
                  : ''
              }
              onClick={() => {
                fetch('/api/simulate', {
                  method: 'POST',
                  body: JSON.stringify({
                    simulation: 'stroke',
                  }),
                });
                setCurrentSimulation('Stroke');
              }}
            >
              Stroke
            </Button>
          </div>
        </div>

        <NoAgentNotification state={agentState} />
      </LiveKitRoom>
    </main>
  );
}

function SimpleVoiceAssistant(props: {
  onStateChange: (state: AgentState) => void;
}) {
  const { state, audioTrack, agentTranscriptions } = useVoiceAssistant();

  useEffect(() => {
    props.onStateChange(state);
  }, [props, state]);

  return (
    <div className='h-[300px] max-w-[90vw] mx-auto'>
      {agentTranscriptions.map((transcription) => (
        <div key={transcription.id}>{transcription.text}</div>
      ))}
      <BarVisualizer
        state={state}
        barCount={5}
        trackRef={audioTrack}
        className='agent-visualizer'
        options={{ minHeight: 24 }}
      />
    </div>
  );
}

function ControlBar(props: {
  onConnectButtonClicked: () => void;
  agentState: AgentState;
}) {
  /**
   * Use Krisp background noise reduction when available.
   * Note: This is only available on Scale plan, see {@link https://livekit.io/pricing | LiveKit Pricing} for more details.
   */
  const krisp = useKrispNoiseFilter();
  useEffect(() => {
    krisp.setNoiseFilterEnabled(true);
  }, []);

  return (
    <div className='relative h-[100px]'>
      <AnimatePresence>
        {props.agentState === 'disconnected' && (
          <motion.button
            initial={{ opacity: 0, top: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, top: '-10px' }}
            transition={{ duration: 1, ease: [0.09, 1.04, 0.245, 1.055] }}
            className='uppercase absolute left-1/2 -translate-x-1/2 px-4 py-2 bg-white text-black rounded-md'
            onClick={() => props.onConnectButtonClicked()}
          >
            Start a conversation
          </motion.button>
        )}
      </AnimatePresence>
      <AnimatePresence>
        {props.agentState !== 'disconnected' &&
          props.agentState !== 'connecting' && (
            <motion.div
              initial={{ opacity: 0, top: '10px' }}
              animate={{ opacity: 1, top: 0 }}
              exit={{ opacity: 0, top: '-10px' }}
              transition={{ duration: 0.4, ease: [0.09, 1.04, 0.245, 1.055] }}
              className='flex h-8 absolute left-1/2 -translate-x-1/2  justify-center'
            >
              <VoiceAssistantControlBar controls={{ leave: false }} />
              <DisconnectButton>
                <CloseIcon />
              </DisconnectButton>
            </motion.div>
          )}
      </AnimatePresence>
    </div>
  );
}

function onDeviceFailure(error?: MediaDeviceFailure) {
  console.error(error);
  alert(
    'Error acquiring camera or microphone permissions. Please make sure you grant the necessary permissions in your browser and reload the tab'
  );
}
