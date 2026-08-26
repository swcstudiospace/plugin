export const DEFAULT_BOARD_NAME = "Spectrum Web Co";
export const TISSUE_VERSION = "1.1.0";
export const TISSUE_DIR = "issues";
export const TISSUE_MARKER = "tissue.json";
export const TISSUE_ID_PREFIX = "tissue:";

export interface IssuesConfig {
	enabled: boolean;
	boardName: string;
	ktuiBin: string;
	echo: boolean;
}

export interface TissueIssue {
	id: string;
	title: string;
	description: string;
	path: string;
	fileName: string;
}

export interface GithubAssoc {
	remoteUrl: string;
	slug: string;
}

export interface KanbanColumn {
	column_id: number;
	name: string;
	visible: boolean;
	position: number;
	board_id: number;
}

export interface KanbanTask {
	task_id: number;
	title: string;
	column: number;
	description: string;
	category?: number;
}

export interface BoardSnapshot {
	boardId: number;
	boardName: string;
	columns: Array<KanbanColumn & { count: number }>;
	tasks: KanbanTask[];
	categoryId: number | null;
	slug?: string;
}

export interface SyncResult {
	issue: TissueIssue;
	taskId: number | null;
	boardId: number | null;
	categoryId: number | null;
	created: boolean;
	skipped: boolean;
	reason?: string;
}

export interface GraphSyncResult {
	workUnitId: string;
	parent: SyncResult;
	children: SyncResult[];
}

export interface IssueTrackState {
	enabled: boolean;
	last?: SyncResult;
}
