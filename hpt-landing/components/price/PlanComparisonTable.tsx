import styles from './PlanComparisonTable.style';

import CheckIcon from '@/assets/svg/blue-check-icon.svg';

import { PLAN_DATA, PLAN_KEYS } from '@/constants/price';

export default function PlanComparisonTable() {
  return (
    <div css={styles.wrapper}>
      {PLAN_DATA.map((category) => (
        <div key={category.category} data-scroll-section={category.category}>
          <div css={styles.categoryTitle}>{category.category}</div>
          <div css={styles.dataRow}>
            {PLAN_KEYS.map((planKey) => (
              <div key={planKey} css={styles.planColumn}>
                {category.features.map((feature) => {
                  const value = feature[planKey];
                  const available = value === true || typeof value === 'string';
                  return (
                    <div
                      key={feature.label}
                      css={[
                        styles.featureItem,
                        !available && styles.featureDisabled,
                      ]}
                    >
                      <CheckIcon css={styles.checkIcon(available)} />
                      <span>
                        {feature.label}
                        {typeof value === 'string' && ` (${value})`}
                      </span>
                    </div>
                  );
                })}
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
