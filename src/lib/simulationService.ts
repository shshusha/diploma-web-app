export interface SimulationData {
  accountId: string;
  timestamp: Date;
  action:
    | 'account_selected'
    | 'dashboard_accessed'
    | 'alert_viewed'
    | 'emergency_triggered';
  metadata?: Record<string, any>;
}

class SimulationService {
  private static instance: SimulationService;
  private currentAccountId: string | null = null;

  private constructor() {}

  static getInstance(): SimulationService {
    if (!SimulationService.instance) {
      SimulationService.instance = new SimulationService();
    }
    return SimulationService.instance;
  }

  setCurrentAccount(accountId: string) {
    this.currentAccountId = accountId;
  }

  getCurrentAccount(): string | null {
    return this.currentAccountId;
  }

  async simulateAccountUsage(data: SimulationData): Promise<void> {
    try {
      // Try to use a custom tRPC endpoint if it exists
      // For now, we'll just log the simulation data
      console.log('Simulating account usage:', {
        accountId: data.accountId,
        timestamp: data.timestamp.toISOString(),
        action: data.action,
        metadata: data.metadata,
      });

      // TODO: Implement actual backend endpoint for simulation
      // This could be a custom tRPC mutation like:
      // await trpc.simulation.logUsage.mutate(data);

      // For now, we'll just store the simulation data locally
      await this.storeSimulationData(data);
    } catch (error) {
      console.error('Failed to simulate account usage:', error);
      // Don't throw error to avoid breaking the app flow
    }
  }

  private async storeSimulationData(data: SimulationData): Promise<void> {
    try {
      // Store simulation data in AsyncStorage for debugging
      const existingData = await this.getStoredSimulationData();
      existingData.push(data);

      // Keep only last 100 entries
      if (existingData.length > 100) {
        existingData.splice(0, existingData.length - 100);
      }

      // In a real app, you'd send this to your backend
      console.log('Stored simulation data:', existingData.length, 'entries');
    } catch (error) {
      console.error('Failed to store simulation data:', error);
    }
  }

  private async getStoredSimulationData(): Promise<SimulationData[]> {
    // This would typically use AsyncStorage, but for now we'll just return empty array
    return [];
  }

  async logDashboardAccess(): Promise<void> {
    if (!this.currentAccountId) return;

    await this.simulateAccountUsage({
      accountId: this.currentAccountId,
      timestamp: new Date(),
      action: 'dashboard_accessed',
    });
  }

  async logAlertView(alertId: string): Promise<void> {
    if (!this.currentAccountId) return;

    await this.simulateAccountUsage({
      accountId: this.currentAccountId,
      timestamp: new Date(),
      action: 'alert_viewed',
      metadata: { alertId },
    });
  }

  async logEmergencyTriggered(): Promise<void> {
    if (!this.currentAccountId) return;

    await this.simulateAccountUsage({
      accountId: this.currentAccountId,
      timestamp: new Date(),
      action: 'emergency_triggered',
    });
  }
}

export const simulationService = SimulationService.getInstance();
