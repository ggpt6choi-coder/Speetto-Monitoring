import React, { useEffect, useState } from 'react';
import { keyframes } from '@emotion/react';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import CircularProgress from '@mui/material/CircularProgress';
import Chip from '@mui/material/Chip';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';

const ResultCardList = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [tab, setTab] = useState(0);
  // 탭별 필터링
  const tabLabels = ['스피또 500', '스피또 1000', '스피또 2000'];
  const filteredData = Array.isArray(data)
    ? data.filter((item) => item.title && item.title.includes(tabLabels[tab]))
    : [];

  useEffect(() => {
    fetch(
      'https://raw.githubusercontent.com/ggpt6choi-coder/Speetto-Monitoring/refs/heads/main/result.json'
    )
      .then((res) => {
        if (!res.ok) throw new Error('데이터를 불러올 수 없습니다.');
        return res.json();
      })
      .then((json) => {
        setData(json);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, []);

  if (loading)
    return (
      <Box display="flex" justifyContent="center" mt={4}>
        <CircularProgress />
      </Box>
    );
  if (error)
    return (
      <Box color="error.main" textAlign="center" mt={4}>
        {error}
      </Box>
    );

  return (
    <Box
      sx={{
        minHeight: '100dvh',
        // 연녹색 그라데이션 + 네잎클로버 SVG 패턴
        background: `linear-gradient(135deg, #e8f5e9 0%, #b9f6ca 100%), url('data:image/svg+xml;utf8,<svg width="80" height="80" viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg"><g opacity="0.13"><path d="M40 20c2.5-7.5 15-7.5 17.5 0 2.5 7.5-7.5 10-7.5 17.5S57.5 45 50 47.5c-7.5 2.5-10-7.5-17.5-7.5S25 57.5 17.5 50c-7.5-7.5 7.5-10 7.5-17.5S22.5 25 30 22.5C37.5 20 40 30 40 20z" fill="%2300c853"/></g></svg>')`,
        backgroundRepeat: 'repeat',
        backgroundSize: 'auto',
        m: 0,
        p: 0,
        boxSizing: 'border-box',
      }}
    >
      <Box sx={{ position: 'relative', zIndex: 1, p: { xs: 1, sm: 2 } }}>
        {/* 애니메이션 keyframes 정의 */}
        <Typography
          variant="h5"
          align="center"
          fontWeight={800}
          sx={{
            mt: 3,
            mb: 1,
            letterSpacing: 1,
            display: 'inline-block',
            animation: `${keyframes`
              0% { transform: translateY(0) scale(1); }
              10% { transform: translateY(-12px) scale(1.08); }
              20% { transform: translateY(0) scale(0.98); }
              30% { transform: translateY(-8px) scale(1.05); }
              40% { transform: translateY(0) scale(1); }
              100% { transform: translateY(0) scale(1); }
            `} 1.5s cubic-bezier(.68,-0.55,.27,1.55) infinite`,
          }}
        >
          🍀스피또 잭팟 현황판🍀
        </Typography>
        <Tabs
          value={tab}
          onChange={(_, v) => setTab(v)}
          centered
          variant="fullWidth"
          sx={{ mb: 2, bgcolor: '#fff', borderRadius: 2, boxShadow: 1 }}
        >
          {tabLabels.map((label, idx) => (
            <Tab
              key={label}
              label={label}
              sx={{
                fontWeight: tab === idx ? 800 : 500,
                color: tab === idx ? '#1b5e20' : 'inherit',
                fontSize: tab === idx ? '1.08rem' : '1rem',
                letterSpacing: 0.5,
                transition: 'all 0.15s',
                whiteSpace: 'nowrap',
                minWidth: 0,
                maxWidth: '100vw',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                px: 2,
              }}
            />
          ))}
        </Tabs>
        <Typography
          variant="subtitle2"
          color="textSecondary"
          align="center"
          gutterBottom
          sx={{ mt: 2, mb: 2 }}
        >
          {filteredData.length > 0 && filteredData[0].storeRateDate
            ? `데이터 기준 (${filteredData[0].storeRateDate})`
            : '데이터 기준 (자동 업데이트)'}
        </Typography>
        <Grid container spacing={3} justifyContent="center">
          {filteredData.length === 0 ? (
            <Grid item xs={12} textAlign="center">
              <Typography color="textSecondary">
                해당 회차 데이터가 없습니다.
              </Typography>
            </Grid>
          ) : (
            filteredData.map((item, idx) => (
              <Grid item xs={12} sm={8} md={6} key={idx}>
                <Card
                  sx={{
                    borderRadius: 4,
                    boxShadow: '0 4px 24px 0 #ffe082, 0 1.5px 8px 0 #ffd600',
                    overflow: 'hidden',
                    display: 'flex',
                    flexDirection: 'column',
                    height: '100%',
                    bgcolor: '#fff',
                    transition: 'transform 0.2s, box-shadow 0.2s',
                    ':hover': {
                      transform: 'scale(1.02)',
                      boxShadow: '0 8px 32px 0 #ffd600, 0 2px 12px 0 #fffde7',
                    },
                  }}
                >
                  {item.img && (
                    <CardMedia
                      component="img"
                      height="200"
                      image={item.img}
                      alt={item.title}
                      sx={{ objectFit: 'cover', width: '100%' }}
                    />
                  )}
                  <CardContent sx={{ flex: 1 }}>
                    <Typography
                      variant="h6"
                      fontWeight={700}
                      gutterBottom
                      align="center"
                    >
                      {item.title}
                    </Typography>
                    {item.ranks && (
                      <TableContainer
                        component={Paper}
                        sx={{ mb: 2, boxShadow: 0 }}
                      >
                        <Table size="small" aria-label="등수별 현황">
                          <TableHead>
                            <TableRow>
                              <TableCell
                                align="center"
                                sx={{ fontWeight: 700 }}
                              >
                                등수
                              </TableCell>
                              <TableCell
                                align="center"
                                sx={{ fontWeight: 700 }}
                              >
                                상금
                              </TableCell>
                              <TableCell
                                align="center"
                                sx={{ fontWeight: 700 }}
                              >
                                남은 수량
                              </TableCell>
                            </TableRow>
                          </TableHead>
                          <TableBody>
                            {item.ranks.map((rank, i) => (
                              <TableRow key={i}>
                                <TableCell
                                  align="center"
                                  sx={{
                                    fontWeight: 600,
                                    color: rank.rank.includes('1')
                                      ? 'error.main'
                                      : rank.rank.includes('2')
                                      ? 'warning.main'
                                      : rank.rank.includes('3')
                                      ? 'info.main'
                                      : 'inherit',
                                  }}
                                >
                                  {rank.rank}
                                </TableCell>
                                <TableCell align="center">
                                  {rank.amount}
                                </TableCell>
                                <TableCell align="center">
                                  {rank.count}
                                </TableCell>
                              </TableRow>
                            ))}
                          </TableBody>
                        </Table>
                      </TableContainer>
                    )}
                    <Box
                      display="flex"
                      flexDirection="column"
                      alignItems="center"
                      mb={2}
                    >
                      <Chip
                        label={
                          <span
                            style={{
                              display: 'inline-flex',
                              alignItems: 'center',
                              padding: 0,
                              lineHeight: 1.2,
                              verticalAlign: 'middle',
                            }}
                          >
                            <span
                              style={{
                                fontWeight: 800,
                                fontSize: '1.15rem',
                                marginRight: 4,
                                color: '#1b5e20',
                                letterSpacing: 0.5,
                                lineHeight: 1.2,
                                verticalAlign: 'middle',
                                display: 'inline-block',
                              }}
                            >
                              판매점 입고율
                            </span>
                            <span
                              style={{
                                fontWeight: 900,
                                color: '#388e3c',
                                fontSize: '1.25rem',
                                marginLeft: 4,
                                letterSpacing: 0,
                                lineHeight: 1.2,
                                verticalAlign: 'middle',
                                display: 'inline-block',
                              }}
                            >
                              {item.storeRatePercent}
                            </span>
                          </span>
                        }
                        color="success"
                        size="medium"
                        sx={{
                          px: 1.2,
                          py: 0.5,
                          minHeight: 32,
                          minWidth: 0,
                          fontFamily: 'inherit',
                          letterSpacing: 0,
                          background: '#e8f5e9',
                        }}
                      />
                      <Typography
                        variant="caption"
                        color="textSecondary"
                        sx={{ mt: 1, textAlign: 'center', lineHeight: 1.5 }}
                      >
                        '판매점 입고율'은 소비자에게 판매된 수량이 아닙니다.
                      </Typography>
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
            ))
          )}
        </Grid>
      </Box>
    </Box>
  );
};
export default ResultCardList;
