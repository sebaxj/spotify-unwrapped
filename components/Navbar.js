import { useSession } from "next-auth/react";
import Avatar from "./Avatar";
import { Chip } from "@mui/material";

export default function Navbar(props) {
  const { data: session, status } = useSession({ required: false });

  if (!session) {
    return;
  }

  return (
    <div style={{ position: "fixed", top: 0, right: 0, zIndex: 1 }}>
      <>
        <Chip
          sx={{
            marginRight: "10px",
            marginTop: "15px",
            fontSize: ".9rem",
            height: "35px",
            display: { xs: 'none', sm: 'flex' } 
          }}
          avatar={<Avatar user={session?.user} size={35} noLink />}
          label={session?.user?.name}
          variant="outlined"
        />
      </>
    </div>
  );
}
