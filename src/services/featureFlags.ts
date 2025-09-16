/**
 * Feature Flags System
 * Enables/disables features dynamically without deployments
 */

import flagsmith from 'flagsmith-js';

interface FeatureFlags {
  // Core features
  enableAdvancedAssetGeneration: boolean;
  enableRealTimeCollaboration: boolean;
  enableAIAssistant: boolean;
  
  // UI features
  enableNewDashboard: boolean;
  enableDarkMode: boolean;
  enableAnimations: boolean;
  
  // Experimental features
  enableBetaFeatures: boolean;
  enablePerformanceMode: boolean;
  enableDebugMode: boolean;
  
  // Business features
  enablePremiumFeatures: boolean;
  enableTeamManagement: boolean;
  enableApiAccess: boolean;
}

class FeatureFlagsService {
  private flags: Partial<FeatureFlags> = {};
  private initialized = false;

  async initialize(): Promise<void> {
    if (this.initialized) return;

    const environmentKey = import.meta.env.VITE_FLAGSMITH_ENVIRONMENT_KEY;
    
    if (environmentKey) {
      try {
        await flagsmith.init({
          environmentID: environmentKey,
          enableAnalytics: true,
          onChange: (oldFlags, params) => {
            this.updateLocalFlags(params.flags);
          },
        });
        
        this.updateLocalFlags(flagsmith.getAllFlags());
        this.initialized = true;
      } catch (error) {
        console.warn('Failed to initialize feature flags:', error);
        this.setDefaultFlags();
      }
    } else {
      this.setDefaultFlags();
    }
  }

  private updateLocalFlags(flagsmithFlags: any): void {
    this.flags = {
      enableAdvancedAssetGeneration: this.getFlagValue(flagsmithFlags, 'enable_advanced_asset_generation', true),
      enableRealTimeCollaboration: this.getFlagValue(flagsmithFlags, 'enable_realtime_collaboration', false),
      enableAIAssistant: this.getFlagValue(flagsmithFlags, 'enable_ai_assistant', true),
      enableNewDashboard: this.getFlagValue(flagsmithFlags, 'enable_new_dashboard', false),
      enableDarkMode: this.getFlagValue(flagsmithFlags, 'enable_dark_mode', true),
      enableAnimations: this.getFlagValue(flagsmithFlags, 'enable_animations', true),
      enableBetaFeatures: this.getFlagValue(flagsmithFlags, 'enable_beta_features', false),
      enablePerformanceMode: this.getFlagValue(flagsmithFlags, 'enable_performance_mode', false),
      enableDebugMode: this.getFlagValue(flagsmithFlags, 'enable_debug_mode', false),
      enablePremiumFeatures: this.getFlagValue(flagsmithFlags, 'enable_premium_features', false),
      enableTeamManagement: this.getFlagValue(flagsmithFlags, 'enable_team_management', false),
      enableApiAccess: this.getFlagValue(flagsmithFlags, 'enable_api_access', false),
    };
  }

  private getFlagValue(flags: any, key: string, defaultValue: boolean): boolean {
    return flags[key]?.enabled ?? defaultValue;
  }

  private setDefaultFlags(): void {
    this.flags = {
      enableAdvancedAssetGeneration: true,
      enableRealTimeCollaboration: false,
      enableAIAssistant: true,
      enableNewDashboard: false,
      enableDarkMode: true,
      enableAnimations: true,
      enableBetaFeatures: false,
      enablePerformanceMode: false,
      enableDebugMode: import.meta.env.VITE_NODE_ENV === 'development',
      enablePremiumFeatures: false,
      enableTeamManagement: false,
      enableApiAccess: false,
    };
    this.initialized = true;
  }

  isEnabled(flag: keyof FeatureFlags): boolean {
    return this.flags[flag] ?? false;
  }

  getAllFlags(): Partial<FeatureFlags> {
    return { ...this.flags };
  }

  // For user-specific flags
  async setUserContext(userId: string, traits?: Record<string, any>): Promise<void> {
    if (flagsmith.environmentID) {
      await flagsmith.setTraits({ user_id: userId, ...traits });
    }
  }
}

export const featureFlagsService = new FeatureFlagsService();
export type { FeatureFlags };

// React hook for feature flags
import { useState, useEffect } from 'react';

export function useFeatureFlag(flag: keyof FeatureFlags): boolean {
  const [isEnabled, setIsEnabled] = useState(false);

  useEffect(() => {
    const checkFlag = async () => {
      await featureFlagsService.initialize();
      setIsEnabled(featureFlagsService.isEnabled(flag));
    };

    checkFlag();
  }, [flag]);

  return isEnabled;
}

export function useFeatureFlags(): Partial<FeatureFlags> {
  const [flags, setFlags] = useState<Partial<FeatureFlags>>({});

  useEffect(() => {
    const loadFlags = async () => {
      await featureFlagsService.initialize();
      setFlags(featureFlagsService.getAllFlags());
    };

    loadFlags();
  }, []);

  return flags;
}
