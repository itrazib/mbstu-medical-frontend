import React, { useEffect, useState } from "react";
import logo from "../../assets/bd.jpg";
import QRCode from "qrcode";
import {
  Document,
  Page,
  Text,
  View,
  Image,
  StyleSheet,
  PDFDownloadLink,
} from "@react-pdf/renderer";

export default function Certificate({ userId }) {
  const [data, setData] = useState(null);
  const [qr, setQr] = useState("");
  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchCertificate = async () => {
      try {
        const res = await fetch(
          `http://localhost:5000/api/vaccine/certificate/${userId}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        const result = await res.json();
        if (res.ok) {
          setData(result);
          const qrData = await QRCode.toDataURL(
            `${window.location.origin}/verify/${result.certificateNo}`
          );
          setQr(qrData);
        }
      } catch (err) {
        console.error(err);
      }
    };
    fetchCertificate();
  }, [userId, token]);

  if (!data) return <h3>Not Verified Yet</h3>;

  const styles = StyleSheet.create({
    page: {
      padding: 40,
      fontFamily: "Times-Roman",
      backgroundColor: "#fefefc",
    },

    container: {
      border: "6px double green",
      padding: 30,
      textAlign: "center",
    },

    topLogo: {
      width: 70,
      alignSelf: "center",
      marginBottom: 10,
    },

    emblem: {
      width: 55,
      alignSelf: "center",
      marginBottom: 5,
    },

    logo: {
      width: 90,
      alignSelf: "center",
      marginBottom: 10,
    },

    header: {
      color: "green",
      fontSize: 20,
      marginBottom: 3,
      fontWeight: "bold",
    },

    subHeader: {
      fontSize: 14,
      marginBottom: 5,
    },

    divider: {
      borderBottomWidth: 1,
      borderBottomColor: "green",
      marginVertical: 10,
      width: "80%",
      alignSelf: "center",
    },

    text: {
      marginBottom: 6,
      fontSize: 12,
    },

    qr: {
      width: 120,
      marginTop: 15,
      alignSelf: "center",
    },

    verified: {
      color: "green",
      marginTop: 10,
      fontSize: 14,
      fontWeight: "bold",
    },
  });

  const CertificatePDF = () => (
    <Document>
      <Page size="A4" style={styles.page}>
        <View style={styles.container}>

          {/* TOP UNIVERSITY DEMO LOGO */}
          <Image src={logo} style={styles.topLogo} />

        

          <Text style={styles.header}>Government of Bangladesh</Text>
          <Text style={styles.subHeader}>COVID-19 Vaccination Certificate</Text>

          {/* horizontal divider */}
          <View style={styles.divider} />

          <Text style={styles.subHeader}>MBSTU Medical Center</Text>

          <Text style={styles.text}>
            <Text style={{ fontWeight: "bold" }}>Name: </Text>
            {data.user.name}
          </Text>

          <Text style={styles.text}>
            <Text style={{ fontWeight: "bold" }}>University ID: </Text>
            {data.user.universityId}
          </Text>

          <Text style={styles.text}>
            <Text style={{ fontWeight: "bold" }}>Vaccine: </Text>
            {data.vaccineName}
          </Text>

          {data.doses.map((d, i) => (
            <Text key={i} style={styles.text}>
              Dose {d.doseNumber} - {d.date} ({d.center}) —{" "}
              <Text style={{ fontWeight: "bold" }}>{d.status}</Text>
            </Text>
          ))}

          <Text style={styles.text}>
            <Text style={{ fontWeight: "bold" }}>Certificate No: </Text>
            {data.certificateNo}
          </Text>

          <Image src={qr} style={styles.qr} />
          <Text style={styles.verified}>✔ Verified</Text>

        </View>
      </Page>
    </Document>
  );

  return (
    <div style={{ textAlign: "center" }}>
      <PDFDownloadLink
        document={<CertificatePDF />}
        fileName="bd-vaccine-certificate.pdf"
      >
        {({ loading }) => (
          <button
            style={{
              marginTop: 20,
              padding: "12px 25px",
              backgroundColor: "green",
              color: "#fff",
              borderRadius: 8,
              fontWeight: "bold",
              cursor: "pointer",
              fontSize: 14,
            }}
          >
            {loading ? "Generating PDF..." : "Download PDF"}
          </button>
        )}
      </PDFDownloadLink>
    </div>
  );
}