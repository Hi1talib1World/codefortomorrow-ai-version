import EventLog from '../../../src/models/eventLog.model';

/**
 * Creates a new event log entry in the database.
 */
export const recordEventEmission = async (
  eventName: string,
  traceId: string,
  payload: any
) => {
  try {
    await EventLog.create({
      eventName,
      traceId,
      payload,
      status: 'pending',
      attempts: 1,
    });
    console.log(`[EventLog] [${traceId}]  Saved event "${eventName}" to DB with status "pending"`);
  } catch (error) {
    console.error(`[EventLog] [${traceId}] Failed to save event log to DB:`, error);
  }
};

/**
 * Updates the status, attempts, and possible errors of an event log entry.
 */
export const updateEventLogStatus = async (
  traceId: string,
  status: 'success' | 'failed',
  attempts: number,
  errorMsg?: string
) => {
  try {
    await EventLog.findOneAndUpdate(
      { traceId },
      { 
        status, 
        attempts,
        ...(errorMsg ? { error: errorMsg } : {})
      },
      { new: true }
    );
    console.log(`[EventLog] [${traceId}]  Updated event log in DB to status "${status}" (attempts: ${attempts})`);
  } catch (error) {
    console.error(`[EventLog] [${traceId}] Failed to update event log status:`, error);
  }
};
