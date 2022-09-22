import { Box, SvgIconProps } from "@mui/material";
import clsx from "clsx";
import Heading6 from "components/common/text/Heading6";
import ParagraphExtraSmall from "components/common/text/ParagraphExtraSmall";
import BasicTooltip from "components/common/tooltip/BasicTooltip";
import { ProjectStatus as ProjectStatus } from "models/project";
import { memo, useMemo } from "react"
import { useTranslation } from "react-i18next";
import classes from './styles.module.scss';
import { Lock } from '@mui/icons-material';

interface LockIconProps extends SvgIconProps {
  status: ProjectStatus
}

export const LockIcon = memo(({ status, className, ...rest }: LockIconProps) => {

  const { t } = useTranslation()

  const statusLabel = useMemo(() => {
    switch (status) {
      case ProjectStatus.AWAIT_PAYMENT:
        return t('project_status_await_payment')
      case ProjectStatus.DRAFT:
        return t('project_status_draft')
      case ProjectStatus.IN_PROGRESS:
        return t('project_status_in_progress')
      case ProjectStatus.COMPLETED:
        return t('project_status_completed')
    }
  }, [status]);

  return (
    <BasicTooltip
      arrow
      title={(
        <>
          <Heading6 mb={0.5}>Uneditable content</Heading6>
          <ParagraphExtraSmall $colorName="--gray-02" variant="caption">
            Content cannot be edited due to the <span style={{ fontWeight: 500, fontStyle: "italic" }}>{statusLabel}</span> status.
          </ParagraphExtraSmall>
        </>
      )}
    >
      <Box className={classes.root}>
        <Lock
          {...rest}
          className={clsx(classes.icon, className,)}
        />
      </Box>

    </BasicTooltip>

  )
})

export default LockIcon