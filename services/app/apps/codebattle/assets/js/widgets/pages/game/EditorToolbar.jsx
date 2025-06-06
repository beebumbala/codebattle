import React from 'react';

import LanguagePicker from '../../components/LanguagePicker';
import UserInfo from '../../components/UserInfo';
import GameRoomModes from '../../config/gameModes';
import Placements from '../../config/placements';

import DarkModeButton from './DarkModeButton';
import EditorResultIcon from './EditorResultIcon';
import GameActionButtons from './GameActionButtons';
import GameBanPlayerButton from './GameBanPlayerButton';
import GameReportButton from './GameReportButton';
import GameResultIcon from './GameResultIcon';
import TournamentUserGameScore from './TournamentUserGameScore';
import UserGameScore from './UserGameScore';
import VimModeButton from './VimModeButton';

const ModeButtons = ({ player }) => (
  <div
    className="btn-group align-items-center mr-auto"
    role="group"
    aria-label="Editor mode"
  >
    <VimModeButton playerId={player.id} />
    <DarkModeButton playerId={player.id} />
  </div>
);

const EditorToolbar = ({
  toolbarRef,
  type,
  mode,
  status,
  player,
  editorState,
  tournamentId,
  editor,
  toolbarClassNames,
  editorSettingClassNames,
  userInfoClassNames,
  langPickerStatus,
  actionBtnsProps,
  showControlBtns,
  isAdmin = false,
  isPremium = false,
  isHistory = false,
}) => (
  <>
    <div ref={toolbarRef} className="rounded-top" data-player-type={type}>
      <div className={toolbarClassNames} role="toolbar">
        <div className="d-flex justify-content-between">
          <div
            className={editorSettingClassNames}
            role="group"
            aria-label="Editor settings"
          >
            <LanguagePicker editor={editor} status={langPickerStatus} />
          </div>
          {showControlBtns && !isHistory && <ModeButtons player={player} />}
        </div>

        <div className="d-flex justify-content-between">
          {showControlBtns && !isHistory && editorState !== 'banned' && (
            <GameActionButtons {...actionBtnsProps} />
          )}
          <div
            className="btn-group btn-group-sm py-2 mx-2"
            role="group"
            aria-label="Report actions"
          >
            {console.log(isPremium, isAdmin)}
            {(isAdmin || isPremium) && !showControlBtns && <GameReportButton userId={player.id} />}
            {isAdmin && !showControlBtns && <GameBanPlayerButton userId={player.id} status={status} tournamentId={tournamentId} />}
          </div>
          <div
            className={userInfoClassNames}
            role="group"
            aria-label="User info"
          >
            <UserInfo user={player} placement={Placements.bottomEnd} />
            {mode === GameRoomModes.standard && (
              <UserGameScore userId={player.id} />
            )}
            {mode === GameRoomModes.tournament && (
              <TournamentUserGameScore userId={player.id} />
            )}
          </div>
        </div>
      </div>
    </div>
    <EditorResultIcon>
      <GameResultIcon userId={editor.userId} />
    </EditorResultIcon>
  </>
);

export default EditorToolbar;
