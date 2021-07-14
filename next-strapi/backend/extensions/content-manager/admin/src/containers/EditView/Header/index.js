import React, { memo, useCallback, useMemo, useRef, useState } from 'react';
import { useIntl } from 'react-intl';
import { Header as PluginHeader } from '@buffetjs/custom';
import { get, isEqual, isEmpty, toString } from 'lodash';
import PropTypes from 'prop-types';
import isEqualFastCompare from 'react-fast-compare';
import { Text } from '@buffetjs/core';
import { templateObject, ModalConfirm } from 'strapi-helper-plugin';
import { getTrad } from '../../../utils';
import { connect, getDraftRelations, select } from './utils';

// 0------------------------------------------------------------------
// ------------------------------------------------------------------
// ------------------------------------------------------------------
import { Inputs } from '@buffetjs/custom';
import { getRequestUrl } from 'strapi-plugin-content-manager/admin/src/containers/CollectionTypeFormWrapper/utils';
import {
  request,
  useGlobalContext,
  useQueryParams,
  formatComponentData,
  contentManagementUtilRemoveFieldsFromData,
} from 'strapi-helper-plugin';
import { useSelector, useDispatch } from 'react-redux';
import {
  getData,
  getDataSucceeded,
  initForm,
  resetProps,
  setDataStructures,
  setStatus,
  submitSucceeded,
} from 'strapi-plugin-content-manager/admin/src/sharedReducers/crudReducer/actions';
import selectCrudReducer from 'strapi-plugin-content-manager/admin/src/sharedReducers/crudReducer/selectors';
// 0------------------------------------------------------------------
// ------------------------------------------------------------------
// ------------------------------------------------------------------

const primaryButtonObject = {
  color: 'primary',
  type: 'button',
  style: {
    minWidth: 150,
    fontWeight: 600,
  },
};

const Header = ({
  allowedActions: { canUpdate, canCreate, canPublish },
  componentLayouts,
  initialData,
  isCreatingEntry,
  isSingleType,
  hasDraftAndPublish,
  layout,
  modifiedData,
  onPublish,
  onUnpublish,
  status,
}) => {
  const [showWarningUnpublish, setWarningUnpublish] = useState(false);
  const { formatMessage } = useIntl();
  const formatMessageRef = useRef(formatMessage);
  const [draftRelationsCount, setDraftRelationsCount] = useState(0);
  const [showWarningDraftRelation, setShowWarningDraftRelation] = useState(false);
  const [shouldUnpublish, setShouldUnpublish] = useState(false);
  const [shouldPublish, setShouldPublish] = useState(false);


  // 0------------------------------------------------------------------
  // ------------------------------------------------------------------
  // ------------------------------------------------------------------
  const [shouldConfirm, setShouldConfirm] = useState(false);
  const [showWarningConfirm, setWarningConfirm] = useState(false);
  const [shouldReject, setShouldReject] = useState(false);
  const [showWarningReject, setWarningReject] = useState(false);
  const [rejectReason, setRejectReason] = useState("");
  // end 0------------------------------------------------------------------
  // ------------------------------------------------------------------
  // ------------------------------------------------------------------


  // 1------------------------------------------------------------------
  // ------------------------------------------------------------------
  // ------------------------------------------------------------------
  const dispatch = useDispatch();
  const {
    componentsDataStructure,
    contentTypeDataStructure,
    data,
    isLoading,
    // status,
  } = useSelector(selectCrudReducer);
  const displayErrors = useCallback(err => {
    const errorPayload = err.response.payload;
    console.error(errorPayload);

    let errorMessage = get(errorPayload, ['message'], 'Bad Request');

    // TODO handle errors correctly when back-end ready
    if (Array.isArray(errorMessage)) {
      errorMessage = get(errorMessage, ['0', 'messages', '0', 'id']);
    }

    if (typeof errorMessage === 'string') {
      strapi.notification.error(errorMessage);
    }
  }, []);

  const onConfirm = async (e) => {
    try {
      const endPoint = getRequestUrl(`application::member-registration.member-registration/${initialData.id}`);
      const data = await request(endPoint, { method: 'PUT', body: { state: 'confirmed' } });
      dispatch(submitSucceeded(data));
      dispatch(setStatus('resolved'));
      strapi.notification.toggle({
        type: 'success',
        message: { id: "Confirmed" },
      });
      await request("/member-registrations/confirm", { method: 'POST', body: initialData, });
    } catch (err) {
      displayErrors(err);
      dispatch(setStatus('resolved'));
    }
  }

  const onReject = async (e) => {
    try {
      const endPoint = getRequestUrl(`application::member-registration.member-registration/${initialData.id}`);
      const data = await request(endPoint, { method: 'PUT', body: { 
        state: 'canceled',
        rejectReason: rejectReason,
      } });
      dispatch(submitSucceeded(data));
      dispatch(setStatus('resolved'));
      strapi.notification.toggle({
        type: 'success',
        message: { id: "Rejected" },
      });
      await request("/member-registrations/reject", { method: 'POST', body: {...initialData, rejectReason}});
    } catch (err) {
      displayErrors(err);
      dispatch(setStatus('resolved'));
    }
  }
  // 1------------------------------------------------------------------
  // ------------------------------------------------------------------
  // ------------------------------------------------------------------

  const currentContentTypeMainField = useMemo(() => get(layout, ['settings', 'mainField'], 'id'), [
    layout,
  ]);

  const currentContentTypeName = useMemo(() => get(layout, ['info', 'name']), [layout]);

  const didChangeData = useMemo(() => {
    return !isEqual(initialData, modifiedData) || (isCreatingEntry && !isEmpty(modifiedData));
  }, [initialData, isCreatingEntry, modifiedData]);
  const apiID = useMemo(() => layout.apiID, [layout.apiID]);

  /* eslint-disable indent */
  const entryHeaderTitle = isCreatingEntry
    ? formatMessage({
      id: getTrad('containers.Edit.pluginHeader.title.new'),
    })
    : templateObject({ mainField: currentContentTypeMainField }, initialData).mainField;
  /* eslint-enable indent */

  const headerTitle = useMemo(() => {
    const title = isSingleType ? currentContentTypeName : entryHeaderTitle;

    return title || currentContentTypeName;
  }, [currentContentTypeName, entryHeaderTitle, isSingleType]);

  const checkIfHasDraftRelations = useCallback(() => {
    const count = getDraftRelations(modifiedData, layout, componentLayouts);

    setDraftRelationsCount(count);

    return count > 0;
  }, [modifiedData, layout, componentLayouts]);

  const headerActions = useMemo(() => {
    let headerActions = [];

    if ((isCreatingEntry && canCreate) || (!isCreatingEntry && canUpdate)) {
      headerActions = [
        {
          disabled: !didChangeData,
          color: 'success',
          label: formatMessage({
            id: getTrad('containers.Edit.submit'),
          }),
          isLoading: status === 'submit-pending',
          type: 'submit',
          style: {
            minWidth: 150,
            fontWeight: 600,
          },
        },
      ];
    }

    if (hasDraftAndPublish && canPublish) {
      const isPublished = !isEmpty(initialData.published_at);
      const isLoading = isPublished ? status === 'unpublish-pending' : status === 'publish-pending';
      const labelID = isPublished ? 'app.utils.unpublish' : 'app.utils.publish';
      /* eslint-disable indent */
      const onClick = isPublished
        ? () => setWarningUnpublish(true)
        : e => {
          if (!checkIfHasDraftRelations()) {
            onPublish(e);
          } else {
            setShowWarningDraftRelation(true);
          }
        };
      /* eslint-enable indent */

      const action = {
        ...primaryButtonObject,
        disabled: isCreatingEntry || didChangeData,
        isLoading,
        label: formatMessage({ id: labelID }),
        onClick,
      };

      headerActions.unshift(action);
    }

    // 2------------------------------------------------------------------
    // ------------------------------------------------------------------
    // ------------------------------------------------------------------
    if (layout.apiID === "member-registration") {
      const actionConfirm = {
        ...primaryButtonObject,
        label: "Confirm",
        disabled: !(initialData.state && initialData.state === 'draft'),
        style: {
          minWidth: 100,
        },
        onClick: (e) => {
          setWarningConfirm(true);
        }
      };

      const actionReject = {
        ...primaryButtonObject,
        label: "Reject",
        color: "delete",
        disabled: !(initialData.state && initialData.state === 'draft'),
        style: {
          minWidth: 100,
        },
        onClick: async (e) => {
          setWarningReject(true);
        }
      };

      headerActions.unshift(actionReject);
      headerActions.unshift(actionConfirm);
    }
    // 2------------------------------------------------------------------
    // ------------------------------------------------------------------
    // ------------------------------------------------------------------

    return headerActions;
  }, [
    isCreatingEntry,
    canCreate,
    canUpdate,
    hasDraftAndPublish,
    canPublish,
    didChangeData,
    formatMessage,
    status,
    initialData,
    onPublish,
    checkIfHasDraftRelations,
  ]);

  const headerProps = useMemo(() => {
    return {
      title: {
        label: toString(headerTitle),
      },
      content: `${formatMessageRef.current({ id: getTrad('api.id') })} : ${apiID}`,
      actions: headerActions,
    };
  }, [headerActions, headerTitle, apiID]);

  const toggleWarningPublish = () => setWarningUnpublish(prevState => !prevState);

  //5--------------------------------------------------------------
  const toggleWarningConfirm = () => setWarningConfirm(prevState => !prevState);
  const toggleWarningReject = () => setWarningReject(prevState => !prevState);
  //end 5--------------------------------------------------------------


  const toggleWarningDraftRelation = useCallback(() => {
    setShowWarningDraftRelation(prev => !prev);
  }, []);

  const handleConfirmPublish = useCallback(() => {
    setShouldPublish(true);
    setShowWarningDraftRelation(false);
  }, []);

  const handleConfirmUnpublish = useCallback(() => {
    setShouldUnpublish(true);
    setWarningUnpublish(false);
  }, []);

  // 6 ---
  const handleConfirmConfirm = useCallback(() => {
    setShouldConfirm(true);
    setWarningConfirm(false);
  }, []);
  const handleConfirmReject = useCallback(() => {
    setShouldReject(true);
    setWarningReject(false);
  }, []);
  // end 6 ---

  const handleCloseModalPublish = useCallback(
    e => {
      if (shouldPublish) {
        onPublish(e);
      }

      setShouldUnpublish(false);
    },
    [onPublish, shouldPublish]
  );

  const handleCloseModalUnpublish = useCallback(
    e => {
      if (shouldUnpublish) {
        onUnpublish(e);
      }

      setShouldUnpublish(false);
    },
    [onUnpublish, shouldUnpublish]
  );


  // 7 ---
  const handleCloseModalConfirm = useCallback(
    e => {
      if (shouldConfirm) {
        onConfirm(e);
      }

      setShouldConfirm(false);
    },
    [onConfirm, shouldConfirm]
  );

  const handleCloseModalReject = useCallback(
    e => {
      if (shouldReject) {
        onReject(e);
      }

      setShouldReject(false);
    },
    [onReject, shouldReject]
  );
  // end 7 ---

  const contentIdSuffix = draftRelationsCount > 1 ? 'plural' : 'singular';

  return (
    <>
      <PluginHeader {...headerProps} />
      <ModalConfirm
        isOpen={showWarningConfirm}
        toggle={toggleWarningConfirm}
        content={{
          id: "Confirm this registration?",
          values: {
            br: () => <br />,
          },
        }}
        type="xwarning"
        onConfirm={handleConfirmConfirm}
        onClosed={handleCloseModalConfirm}
      >
      </ModalConfirm>
      <ModalConfirm
        isOpen={showWarningReject}
        toggle={toggleWarningReject}
        content={{
          id: "Reject this registration?",
          values: {
            br: () => <br />,
          },
        }}
        type="xwarning"
        onConfirm={handleConfirmReject}
        onClosed={handleCloseModalReject}
      >
        <Inputs
          // customInputs={{ custom: Foo }} // Props to pass custom input type to the component
          name={"rejectReason"}
          description="Enter your reject reason"
          label='Please enter your reject reason before continue!'
          placeholder='Enter your reject reason'
          type='textarea'
          validations={{ required: true }}
          onChange={e => setRejectReason(e.target.value)}
          value={rejectReason}
        />
      </ModalConfirm>
      {hasDraftAndPublish && (
        <>
          <ModalConfirm
            isOpen={showWarningUnpublish}
            toggle={toggleWarningPublish}
            content={{
              id: getTrad('popUpWarning.warning.unpublish'),
              values: {
                br: () => <br />,
              },
            }}
            type="xwarning"
            onConfirm={handleConfirmUnpublish}
            onClosed={handleCloseModalUnpublish}
          >
            <Text>{formatMessage({ id: getTrad('popUpWarning.warning.unpublish-question') })}</Text>
          </ModalConfirm>
          <ModalConfirm
            confirmButtonLabel={{
              id: getTrad('popUpwarning.warning.has-draft-relations.button-confirm'),
            }}
            isOpen={showWarningDraftRelation}
            toggle={toggleWarningDraftRelation}
            onClosed={handleCloseModalPublish}
            onConfirm={handleConfirmPublish}
            type="success"
            content={{
              id: getTrad(`popUpwarning.warning.has-draft-relations.message.${contentIdSuffix}`),
              values: {
                count: draftRelationsCount,
                b: chunks => (
                  <Text as="span" fontWeight="bold">
                    {chunks}
                  </Text>
                ),
                br: () => <br />,
              },
            }}
          >
            <Text>{formatMessage({ id: getTrad('popUpWarning.warning.publish-question') })}</Text>
          </ModalConfirm>
        </>
      )}
    </>
  );
};

Header.propTypes = {
  allowedActions: PropTypes.shape({
    canUpdate: PropTypes.bool.isRequired,
    canCreate: PropTypes.bool.isRequired,
    canPublish: PropTypes.bool.isRequired,
  }).isRequired,
  componentLayouts: PropTypes.object.isRequired,
  initialData: PropTypes.object.isRequired,
  isCreatingEntry: PropTypes.bool.isRequired,
  isSingleType: PropTypes.bool.isRequired,
  status: PropTypes.string.isRequired,
  layout: PropTypes.object.isRequired,
  hasDraftAndPublish: PropTypes.bool.isRequired,
  modifiedData: PropTypes.object.isRequired,
  onPublish: PropTypes.func.isRequired,
  onUnpublish: PropTypes.func.isRequired,
};

const Memoized = memo(Header, isEqualFastCompare);

export default connect(Memoized, select);
