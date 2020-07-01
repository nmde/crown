import * as tsx from 'vue-tsx-support';

type Empty = {};
type TSXProps<P extends Vue> = tsx.DeclareProps<tsx.AutoProps<P>>
& tsx.DeclareOnEvents<Empty>
& tsx.DeclareOn<Empty>
& tsx.DeclareAttributes<Empty>;

export default TSXProps;
