import * as student from "~/database/actions/student";
import * as batch from "~/database/actions/batch";
import { Suspense } from "react";
import useSWR from "swr";
import {
  Card,
  CardHeader,
  makeStyles,
  Spinner,
  Text,
  Title1,
} from "@fluentui/react-components";

async function getCount() {
  const [{ studentCount }, { batchCount }] = await Promise.all([
    student.count(),
    batch.count(),
  ]);
  return { studentCount, batchCount };
}

export default function HomePage() {
  return (
    <Suspense fallback={<Spinner />}>
      <HomePageInner />
    </Suspense>
  );
}

const useStyles = makeStyles({
  container: {},
  title: {
    fontWeight: 500,
    marginBottom: "0.5rem",
  },
  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))",
    gap: "1rem",
    marginTop: "1rem",
  },
  card: {
    width: "360px",
    maxWidth: "100%",
    height: "fit-content",
  },
  text: { margin: "0" },
});

function HomePageInner() {
  const { data } = useSWR(["count"], getCount, { suspense: true });
  const classes = useStyles();

  return (
    <div>
      <Title1 className={classes.title}>Welcome back, Boss 🫡!</Title1>
      <p>Here is the overview of your account:</p>
      <div className={classes.grid}>
        <Card className={classes.card} appearance="outline">
          <CardHeader header={<Text weight="bold">Total Students</Text>} />
          <p className={classes.text}>{data.studentCount}</p>
        </Card>
        <Card className={classes.card} appearance="outline">
          <CardHeader header={<Text weight="bold">Total Batches</Text>} />
          <p className={classes.text}>{data.batchCount}</p>
        </Card>
      </div>
    </div>
  );
}
