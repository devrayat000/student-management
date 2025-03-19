import { Suspense } from "react";
import useSWR from "swr";
import { useParams } from "react-router";

import {
  Button,
  Field,
  Input,
  Label,
  makeStyles,
  Spinner,
  tokens,
} from "@fluentui/react-components";
import DetailsPageLayout from "~/pages/DetailsPageLayout";
import * as student from "~/database/actions/student";
// import DeletePrompt from "~/components/common/DeletePrompt";
import PaymentHistory from "./PaymentHistory";

export default function StudentDetailsPage() {
  return (
    <DetailsPageLayout title="Student Details">
      <Suspense fallback={<Spinner />}>
        <StudentDetailsPageInner />
      </Suspense>
    </DetailsPageLayout>
  );
}

const useStyles = makeStyles({
  formContainer: {
    display: "flex",
    flexDirection: "column",
    gap: tokens.spacingVerticalS,
  },
  idField: {
    display: "flex",
    justifyContent: "flex-end",
  },
  idInput: {
    width: "13rem",
  },
  deleteBtn: {
    width: "100%",
    backgroundColor: tokens.colorStatusDangerForeground3,
    color: tokens.colorStatusDangerBackground1,
    ":hover": {
      backgroundColor: tokens.colorStatusDangerForegroundInverted,
    },
    ":hover:active": {
      backgroundColor: tokens.colorStatusDangerForeground2,
    },
  },
});

function StudentDetailsPageInner() {
  const { studentId } = useParams();
  const { data } = useSWR(
    ["students", studentId],
    ([, id]) => student.readOne(id),
    {
      suspense: true,
    }
  );
  const classes = useStyles();

  return (
    <div>
      <div className={classes.formContainer}>
        <Field className={classes.idField}>
          <Input
            disabled
            defaultValue={data?.id.toString()}
            className={classes.idInput}
          />
        </Field>
        <Field label="Student's Name">
          <Input disabled defaultValue={data?.name} />
        </Field>
        <Field label="Phone no.">
          <Input type="tel" disabled defaultValue={data?.phone} />
        </Field>
        <Field label="Class">
          <Input disabled defaultValue={data?.class?.toString()} />
        </Field>
        <Field label="Batch">
          <Input disabled defaultValue={data?.batch?.toString()} />
        </Field>
        <Button appearance="primary" className={classes.deleteBtn}>
          Delete
        </Button>
      </div>

      <div className="mt-3">
        <PaymentHistory />
      </div>
    </div>
  );
}
