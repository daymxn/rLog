// eslint-disable-next-line prettier/prettier
import React from "react";
import useDocusaurusContext from "@docusaurus/useDocusaurusContext";
import Layout from "@theme/Layout";

import { Icon } from "@iconify/react/dist/iconify.js";
import { Button, Grid, Typography } from "@mui/material";
import Logo from "@site/static/img/logo.svg";

function HomePage() {
  const { siteConfig } = useDocusaurusContext();

  return (
    <Grid container spacing={2} textAlign={"center"} paddingTop={"5rem"} paddingBottom={"3rem"}>
      <Grid item xs={12}>
        <Logo style={{ maxWidth: "15rem", justifySelf: "center" }} filter="drop-shadow(0px 0px 6px black)" />
        <Typography fontWeight={"bold"} variant="h1">
          {siteConfig.title}
        </Typography>
      </Grid>
      <Grid item xs={12}>
        <Typography variant="subtitle1">{siteConfig.tagline}</Typography>
      </Grid>
      <Grid container item xs={12} spacing={2} textAlign={"center"} justifyContent={"center"} marginTop={"-.5rem"}>
        <Grid item xs={12} md={"auto"} marginLeft={"1rem"} marginRight={"1rem"}>
          <Button
            size="large"
            color="info"
            variant="contained"
            endIcon={<Icon icon={"solar:play-bold-duotone"} />}
            fullWidth
            sx={{ textShadow: "0px 0px 4px rgba(255, 255, 255, 0.8)" }}
            href="/docs/quick-start"
          >
            Get Started
          </Button>
        </Grid>
        <Grid item xs={12} md={"auto"}>
          <Button
            target="_blank"
            href={"https://github.com/daymxn/rLog"}
            size="large"
            color="inherit"
            variant="text"
            endIcon={<Icon icon={"mdi:external-link"} />}
            fullWidth
          >
            View on GitHub
          </Button>
        </Grid>
      </Grid>
    </Grid>
  );
}

export default function Home(): JSX.Element {
  const { siteConfig } = useDocusaurusContext();
  return (
    <Layout title={siteConfig.title} description={siteConfig.tagline}>
      <HomePage />
    </Layout>
  );
}
