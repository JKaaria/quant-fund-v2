export type StrategyId = 'S001'|'S031'|'S051'|'S076'|'S111'|'S122'|'S128';
export type Attribution = {allocation:number|null;active:boolean;pnl:number|null;evaluation_status:string};
export type Observation = {
  date:string;observation_status:string;observation_timing:string;observed_at:string;
  nav:number|null;nav_status:string;virtual_allocation_nav:number|null;allocation_reserve:number|null;
  daily_pnl:number|null;daily_return:number|null;cumulative_return:number|null;cash:number|null;cash_weight:number|null;
  gross_exposure:number|null;net_exposure:number|null;exposure_status:string;asset_class_exposure:null;
  regime:Record<string,string>;active_strategies:StrategyId[];strategy_attribution:Record<StrategyId,Attribution>;
  positions_count:number|null;trades_count:number|null;transaction_costs:number|null;costs_status:string;
  positions_as_of:string|null;positions:{symbol:string;weight:number|null}[];positions_status:string;
  public_run_id:string;source_commit:string|null;publication_hash:string;schema_version:string;fund_version:string;
};
export type Strategy = {strategy_id:StrategyId;strategy_name:string;economic_role:string;hypothesis:string;
  strategy_family:string;asset_class:string[];signal_description:string|null;expected_edge:string;horizon:string;
  regime_dependency:string|null;production_status:string;scientific_limitation:string|null};
export type Correction = {date:string;original_hash:string;corrected_hash:string;correction_timestamp:string;reason:string;source_evidence:string};
export type Dataset = {
  manifest:{schema_version:string;fund_version:string;strategy_set_version:string;forward_inception_date:string;
    latest_observation_date:string;observation_count:number;latest_publication_hash:string;files:Record<string,string>};
  fund:{fund_name:string;fund_type:string;base_currency:string;paper_trading:boolean;starting_nav:number;
    forward_inception_date:string;strategy_set_version:string;strategy_ids:StrategyId[];last_updated:string;disclaimer:string;fund_version:string};
  latest:Observation;observations:Observation[];performance:Observation[];strategies:Strategy[];corrections:Correction[];
  metrics:{status:string;return_observation_count:number;minimum_observations:number;[key:string]:string|number|null};
  methodology:{schema_version:string;pipeline:string[];accounting:string;inception:string;position_publication_delay_days:number;
    position_delay_policy:string;attribution:string;costs:string;benchmarks:string;scientific_limitations:string[];data_rights:string;
    minimum_return_observations:number;annualization_periods:number;risk_free_rate:number};
  benchmark:{status:string;benchmark_id:string|null;cumulative_return:number|null};
};
