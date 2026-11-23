---
cate: 回复信
date: 2026-06-11
scene_alias: Reviewer 2
tags:
  - output
  - project/demo
longform: true
status: not-started
---

> [!comment] Reviewer #2
>
> (Remarks to the Author)
> This manuscript combines a four‑century archival Wet/Dry Index (WDI) for northern China with tree‑ring‑based hydroclimate reconstructions and an agent‑based model (ABM) to argue that Shifting Baseline Syndrome (SBS) imprints generational‑scale biases on collective memory of climate extremes. Empirically, the authors show systematic mismatches between a "subjective" archive‑based WDI and an "objective" proxy‑based WDI, and that re‑standardising the proxy series within 20–40‑year sliding windows increases rank correlation. An ABM with agents that remember only a finite past is then claimed to reproduce an optimal window of ~30 years. My overall assessment is that the topic and basic idea are interesting and potentially significant, but the current manuscript is far from the level of scientific accuracy and clarity required for publication.
>
> ---
> **中文翻译：** 本文将中国北方长达四个世纪的档案湿/旱指数（Wet/Dry Index, WDI）与基于树轮的水文气候重建，以及一个基于主体的模型（Agent‑Based Model, ABM）结合起来，旨在论证"基线转移综合征"（Shifting Baseline Syndrome, SBS）会在代际尺度上给极端气候的集体记忆打上偏差烙印。在实证层面，作者展示了"主观"的、基于档案的 WDI 与"客观"的、基于代用指标（proxy）的 WDI 之间存在系统性不匹配，并指出在 20–40 年滑动窗口内对代用指标序列进行重新标准化（re‑standardising）可以提高秩相关（rank correlation）。随后作者声称：一个仅记住有限过去的主体的 ABM 能再现约 30 年的最优窗口。我的总体评价是：研究主题与基本想法有趣且可能具有重要意义，但目前稿件在科学准确性与清晰度方面仍远未达到可发表的水平。

**Response:** We thank the reviewer for the careful and constructive reviews and for recognising the interest and potential significance of this research. We have taken the comments seriously and substantially strengthened both the codebase, analysis and the presentation. In particular, we: (i) corrected the four code issues the reviewer identified. Three of them do not affect the results at all; they are merely code formatting or redundancy. One has a limited impact only on the ABM result and does not change the core conclusions. (ii) added climate-forcing scenarios for a robustness matrix and a full two-stage global sensitivity analysis (Morris + Sobol); (iii) reframed the ABM as a falsifiable mechanism-discrimination test (generational amnesia v.s. collective memory illusion) rather than a "calibrated toy model", and (iv) revised the research-question framing, the Monte-Carlo description, the main-text ABM description, and the figures for clarity. The point-by-point responses below detail each change. We are pleased to report that none of the corrections alter our central conclusions. We thank you again for your thorough review and hope the new version meets your satisfaction.

%% 我们感谢评审对本研究所给出的细致且具有建设性的评审意见，并感谢您认同本研究的兴趣和潜在重要性。我们已认真对待这些意见，并在代码库、分析和陈述上进行了实质性强化。具体而言，我们：（i）纠正了评审指出的四个代码问题。其中三个完全不影响结果，仅为代码格式或冗余问题；另一个仅对基于主体的模型（ABM）结果有有限影响，但并不改变核心结论；（ii）为稳健性矩阵添加了气候强迫情景，并完成了完整的两阶段全局敏感性分析（Morris + Sobol）；（iii）将ABM重新表述为一个可证伪的机制辨别检验（代际失忆与集体记忆错觉），而非“校准的玩具模型”；以及（iv）为澄清研究问题框架、蒙特卡洛描述、正文中ABM描述和图表进行了修订。下面的逐点回应详细说明了每一项改动。我们高兴地报告，这些修正均未改变我们的核心结论。再次感谢您细致的评审，我们希望新版能令您满意。 %%

## Major comments

%% 我们感谢审稿人对我们仪器观测验证期设计的准确概述，并肯定了集体记忆不会污染该验证。此步骤是处理年轮数据以在资料有限时尽可能重建历史极端气候的必要环节。我们现已在正文中加入一句话以更清楚地表述这一假设。%%

> [!quote] Reviewer #2
> However, the main research questions as formulated in the Introduction are not actually answered by the methods applied. The authors state that they "test the degree to which period-specific perception bias influences the formation of historical narratives of extreme climatic events" and that perceptual bias leads to a "generational offset in collective memory". What they measure empirically are (i) discrepancies between categorical WDI assignments in two already‑constructed series, (ii) changes in Kendall's τ under sliding‑window re‑standardisation of the objective WDI, and (iii) the behaviour of a stylised ABM driven by i.i.d. normal climate noise. These are not direct measurements of the "formation of historical narratives" or of a "degree" of bias in narrative construction. The archival WDI is itself a heavily processed regional index, which has already collapsed many qualitative narratives into a single ordinal time series. Without an explicit, operational definition of "formation of narratives" and a corresponding quantitative metric, the strong claims about how narrative formation is influenced by period‑specific perception bias are not supported by the current analyses. This could be solved by rewriting the research question.
>
> ---
> **中文翻译：** 然而，引言中所表述的主要研究问题，实际上并未被所采用的方法回答。作者称其"检验特定时期的知觉偏差在多大程度上影响极端气候事件历史叙事的形成"，并认为知觉偏差导致"集体记忆的代际偏移"。但作者实证上测量的内容是：(i) 两个已构建序列中类别化 WDI 赋值之间的差异；(ii) 在对"客观"WDI 进行滑动窗口重新标准化后 Kendall's τ 的变化；以及 (iii) 由独立同分布（i.i.d.）正态气候噪声驱动的一个风格化 ABM 的行为。这些并不是对"历史叙事形成"或"叙事建构偏差程度"的直接测量。档案 WDI 本身就是一个高度处理后的区域指数，它已将大量定性叙事压缩为单一的序数时间序列。在缺乏对"叙事形成"的明确、可操作化定义及相应定量指标的情况下，关于叙事形成如何受特定时期知觉偏差影响的强主张，无法被当前分析所支撑。这个问题可以通过重写研究问题来解决。

**Response:**  We thank the reviewers for their valuable comments. We acknowledge that the current approach lacks a direct measurement of perceptual bias during the “formation of narratives,” and instead relies on already formed historical narratives (manifestations of “collective memory”) and quantifies their alignment with proxy indicator data to reflect the presence of “perceptual bias” in historical narratives. We have now rephrased the text to more sharply highlight our contribution to understanding perceptual biases of the SBS type; specific revisions include:

- SBS is only one of many perceptual biases, and we explicitly limit the current study’s shortcoming to the discussion scope of “SBS.” We confirm the existence of this bias in historical memory, thereby directing the research question to a more specific target that better matches the kinds of direct evidence our methodological framework can provide:

*Among the many perceptual biases, Shifting Baseline Syndrome (SBS) [@pauly1995], also referred to as Environmental Generations Amnesia (**Figure 1a**) [@kahnjr.2002]. This phenomenon suggests that the decayed memory of environmental changes across generations arises from comparisons to a “shifting” baseline, which serves as a reference point for comparison and a perceived “normal” based on limited memory and experience [@papworth2009; @soga2018]. It has long been suggested that SBS can result in cross-generational inconsistencies in their environmental perception [@schuman1989], undermining the potential for collective action [@fritsche2021]. The inconsistency may stem from multiple sources, including individual amnesia or blindness in front of changes, but two collective factors, generational amnesia or a illusion emerged from collective memory, are suggested as the main roots of SBS (**Figure 1b**) [@papworth2009]. Generational amnesia occurs when younger generations lack knowledge of past environmental conditions, whereas collective memory illusion arises when shared narratives or expectations distort how past conditions are remembered [@papworth2009]. Nevertheless, long-term quantitative evidence is still lacking on wether SBS shapes collective memory of climate change and which route does the associated perceptual bias come from.*

Logically, SBS emphasizes differences in perceptions of environmental change across generations. We use a revised Figure 1 to present two frequently cited reasons behind this phenomenon and underscore that our study, while confirming the existence of the SBS phenomenon, helps explain its causes. In the section related to multi-agent models, we have already phrased the research question as:

*Here, we develop a novel approach to test wether the SBS plays a significant role in which period-specific perception bias influences the formation of historical narratives of extreme climatic events over long-time scales (here defined as centuries or cross-generational). We test two hypotheses: (1) for a given time point, historical archives of climatic extremes are influenced by contemporaneous perceptual bias; (2) over the course of decades and centuries, this perceptual bias leads to a generational offset in collective memory relative to ‘natural’ observations of climatic variation.*

%%
感谢审稿人提出的宝贵意见，我们承认当前的方法缺乏对“叙事形成”中感知偏差的直接度量，而是借助已经形成的历史叙事（“集体记忆”的表现）并量化其与代用指标数据的对齐程度来反映“感知偏差”在历史叙事中存在。现在，我们已经重新表述，更聚焦地突出我们对理解 SBS 这类感知偏差的贡献，具体修改包括：

- SBS 只是众多感知偏差的一种，我们直接把当前的研究不足限定在“SBS”的讨论范畴内，确认该偏差在历史记忆中存在，从而将研究问题指向更具体、更符合方法框架能带来直接证据的目标：
- 在逻辑上，SBS 这强调不同代际之间对环境变化感知的差异。我们用修改后的图 1 展示了这种现象背后被频繁引用的两个原因，并强调我们的研究在确认 SBS 现象存在的基础上，有助于解释其产生原因。在多主体模型相关的部分，我们已经把研究问题表述为：

%%

> [!quote] Reviewer #2
> Relatedly, the notion of "degree to which period‑specific perception bias influences the formation of historical narratives" lacks a clear sense of direction or observable quantity. It is not specified whether "more formation" should mean more narratives per event, more detailed descriptions, higher probability of recording, or something else. Nor is there any attempt to count or otherwise quantify the number of distinct historical narratives as a function of climate anomalies. In practice, the paper infers perceptual bias solely from the relative alignment of an archive‑based index and a proxy‑based index. This is a much narrower question than the one formulated in the Introduction, and the framing should be revised accordingly or the analyses significantly expanded.
>
> ---
> **中文翻译：** 与此相关，"特定时期知觉偏差在多大程度上影响历史叙事形成"这一表述缺乏明确的方向性或可观测量。文中并未说明"形成更多"意味着什么：是指每个事件对应更多叙事、描述更细致、记录概率更高，还是其他含义。作者也没有尝试统计或以其他方式量化"不同历史叙事的数量"如何随气候异常变化。实际上，论文仅依据档案指数与代用指标指数的相对对齐程度来推断知觉偏差。这比引言中提出的问题要狭窄得多，因此应相应修改框架表述，或显著扩展分析以匹配原先的研究问题。

**Response:** After revising the research questions, we also removed expressions like "degree to..."; the current contributions are now clearly narrowed to (1) our quantitative analysis demonstrates that SBS has played a role in historical climate records; (2) the agent-based model can suggest the more possible mechanisms by which SBS exerts its effects.

%% 在修订研究问题后，我们还删除了诸如“程度上……”之类的表述；当前的贡献明确缩窄为：(1) 我们的定量分析表明 SBS 在历史气候记录中发挥了作用；(2) 基于主体的模型可以提示 SBS 发挥其影响的更可能机制。 %%

> [!quote] Reviewer #2
> The ABM description in the main text is highly insufficient, even for readers familiar with ABMs. Section 2.4 and Figure 5 give only a schematic overview ("a batch of observers who perceive climatic extremes and may record their perceptions of severity levels", with two baseline options), while all substantive detail is pushed to SI S3. For a general‑audience journal, the main text should summarize at least the nature of the climate process, the agents' memory structure, the decision rule for recording, the demographic process, and how the model outputs are converted into a WDI‑like series. As written, it is impossible to understand from the main text alone how Figure 5 was produced or in what sense the model "reproduces" the empirical pattern. The description should also make explicit that anchoring and negativity bias, which are emphasised in the SI as theoretical foundations, are actually implemented in the recording propensity and baseline construction; at present, these cognitive mechanisms are not mentioned in the modelling section of the main text, and anchoring appears only later in the Discussion as a general cognitive process, not as something concretely encoded in the ABM.
>
> ---
> **中文翻译：** 正文对 ABM 的描述极其不足，即便对熟悉 ABM 的读者也是如此。第 2.4 节与图 5 仅给出示意性概览（"一组观察者感知气候极端并可能记录其严重程度感知"，并提供两种基线选项），而所有实质性细节都被推到补充信息（SI）S3。对于面向大众读者的期刊，正文至少应概括：气候过程的性质、主体的记忆结构、记录决策规则、人口过程，以及如何将模型输出转换为类似 WDI 的序列。按目前写法，读者不可能仅凭正文理解图 5 是如何生成的，也不清楚模型在何种意义上"再现"了实证模式。描述还应明确：在 SI 中作为理论基础强调的"锚定效应"和"负性偏差"，实际上是通过记录倾向与基线构建被实现的；目前这些认知机制在正文的建模部分并未提及，锚定效应只在讨论部分后面以一般认知过程出现，而非作为 ABM 中被具体编码的机制。

**Response:** _（正文写作类修订：在正文中补充 ABM 的气候过程、记忆结构、记录决策规则、人口过程与输出到 WDI 的转换，并明确锚定/负性偏差在代码中的实现位置。留待作者在稿件中修改，此处暂不起草。）_

%% 此条属正文写作意见，留待作者在稿件中处理，本回复文件不予起草。 %%

> [!quote] Reviewer #2
> In the ABM code, the z-score formula is wrong due to operation precedence: `climate - baseline/std` should be `(climate - baseline)/std`. This must completely change the results.
>
> ---
> **中文翻译：** 在 ABM 代码中，由于运算优先级问题，z-score 公式是错误的：`climate - baseline/std` 应为 `(climate - baseline)/std`。这必然会完全改变结果。

**Response:** We are grateful to the reviewer for catching this — it was a genuine bug in the observer's perception/standardisation step, and we have corrected it to the properly parenthesised form `(climate - baseline) / std` (`shifting_baseline/abm.py`, `Observer.perceive`). The error had escaped our own checks because both `climate` and `baseline` are themselves already standardised (z-score) quantities, so the mis-grouped expression still produced numerically plausible values rather than visibly anomalous ones, and was therefore overlooked. After the correction, the error/uncertainty band widens, but the previously reported pattern persists and remains statistically significant; fortunately, the fix does not change our conclusions. We have re-run the affected figures with the corrected code.

%% 非常感谢审稿人发现了这一问题——这确实是观察者"感知/标准化"步骤中的一个真实缺陷，我们已将其更正为正确加括号的形式 `(climate - baseline) / std`（见 `shifting_baseline/abm.py` 的 `Observer.perceive`）。该错误之所以躲过了我们自己的检查，是因为 `climate` 与 `baseline` 本身都已经是标准化（z-score）量，因此分组有误的表达式仍会给出在数值上看似合理、而非肉眼可见异常的结果，从而被忽视。更正之后，误差/不确定性带变宽，但此前报告的格局依然存在且统计显著；幸运的是，该修复并未改变我们的结论。我们已用更正后的代码重新生成了受影响的图件。 %%

> [!quote] Reviewer #2
> The temporal and climatic structure of the ABM needs stronger justification and exploration. Time advances in annual ticks and the climate series is generated as N(0,1) at each step. The annual timestep is chosen to match the yearly WDI, which is reasonable, but it ignores trends and persistence that are likely present in actual climate. The authors then interpret the ~30‑year optimal sliding window emerging from this model as supporting a generational SBS mechanism. Given the simplistic climate process, the untested sensitivity of the model output to various assumption, this claim is fragile. The model's results may be highly sensitive to the arbitrary timestep (e.g. if the model ran at seasonal resolution, the effective memory window in years could change), there is a peculiar age structure, no population growth, and no trend or autocorrelation in weather. The statement that "collective climate records aligned with the continuous climate" is also misleading: in the model, climate is not a continuous physical process but independent Gaussian noise. At minimum, the authors should justify the annual step in terms of the empirical WDI and discuss whether and how alternative temporal resolutions or realistic climate processes (with trend and persistence) would affect the emergent memory window.
>
> ---
> **中文翻译：** ABM 的时间结构与气候结构需要更强的论证与更充分的探索。模型以年度为时间步推进，每一步的气候序列按 N(0,1) 生成。选择年度时间步以匹配年度 WDI 是合理的，但它忽略了真实气候中很可能存在的趋势与持续性（persistence）。作者随后将该模型中出现的约 30 年最优滑动窗口解释为支持代际尺度的 SBS 机制。鉴于气候过程过于简化，且模型输出对诸多假设的敏感性未被检验，这一主张是脆弱的。模型结果可能对任意设定的时间步高度敏感（例如如果以季节尺度运行，换算到"年"的有效记忆窗口可能变化）；模型还具有不自然的年龄结构、没有人口增长、天气也不存在趋势或自相关。关于"集体气候记录与连续气候对齐"的表述也具有误导性：在模型中，气候并非连续的物理过程，而是相互独立的高斯噪声。至少，作者应从实证 WDI 的角度论证年度时间步的合理性，并讨论更高时间分辨率或更真实的气候过程（带趋势与持续性）将如何影响所涌现的记忆窗口。

**Response:** We have addressed this concern directly with a climate-forcing robustness matrix. The ABM now supports three forcing processes — i.i.d. Gaussian white noise, AR(1) persistence (`climate_phi`), and a linear trend plus noise (`trend_plus_noise`) — at two temporal resolutions (annual, and sub-annual at four steps per year aggregated back to annual values, so all peak-window statistics remain in yearly units). Across all six configurations (10 replicates each) the emergent optimal window remains within the ~20–40-year generational band (means 23–43 yr; peak correlation strength 0.85–0.91 throughout), confirming the result is not an artefact of the i.i.d. assumption, of climate persistence/trend, or of the annual timestep. The annual step is retained as the baseline because the empirical comparison target (WDI and tree-ring series) is itself annual.

We accordingly soften the main claim to: *"the emergent optimal window lies in the 20–40-year generational band across a range of climate forcings (i.i.d., AR(1), and trend-plus-noise) at annual resolution, consistent with the empirical ~30-year optimum; the window broadens modestly under sub-annual forcing but remains generational in scale."* We also note in the SI that the tick-to-year σ rescaling is exact only for i.i.d. forcing, so the sub-annual comparison is indicative rather than variance-matched.

%% 我们用一个气候强迫稳健性矩阵直接回应了这一关切。ABM 现支持三种强迫过程——i.i.d. 高斯白噪声、AR(1) 持续性（`climate_phi`）、以及线性趋势叠加噪声（`trend_plus_noise`）——并在两种时间分辨率下运行（年度，以及每年 4 步的年内强迫，再聚合回年度值，因此所有峰值窗口统计仍以"年"为单位）。在全部六种配置下（各 10 次重复），涌现的最优窗口始终落在约 20–40 年的代际区间内（均值 23–43 年；峰值相关强度全程为 0.85–0.91），证明该结果并非来自 i.i.d. 假设、气候持续性/趋势或年度时间步的伪影。之所以保留年度步长作为基线，是因为实证比较对象（WDI 与树轮序列）本身即为年尺度。

据此，我们将主要结论弱化为："在年度分辨率下，涌现的最优窗口在多种气候强迫（i.i.d.、AR(1)、趋势叠加噪声）下都位于 20–40 年的代际区间内，与实证约 30 年的最优值一致；在年内强迫下窗口略有展宽，但仍保持在代际尺度。"我们也在 SI 中说明，从 tick 到 year 的 σ 重标定仅对 i.i.d. 强迫严格成立，因此年内—年度的对比应理解为指示性的，而非严格的方差匹配。 %%

> [!quote] Reviewer #2
> Demographic assumptions in the ABM also warrant more careful treatment. The model introduces a fixed number of new agents each year and removes agents at maximum age, with no dependence of births or deaths on current population size. This produces a flat age distribution between the minimum and maximum ages. Because each agent's memory window and thus their baseline length depends on age, the resulting collective memory is strongly shaped by this artificial age structure, which does not resemble actual historical demography. The authors link their empirical 20–40‑year sliding window to "the generational life expectancy of humans in ancient China", yet the default model uses a maximum age of 40 years (in the SI) or 60 years (in the main Methods) and a recruitment process that is not tied to any empirical demographic data. They report an ANOVA‑based sensitivity analysis on a limited set of parameters, for which they don't report effect sizes, but this is not a global sensitivity analysis in the usual sense: there is no Sobol or Morris‑type decomposition to quantify how much of the variance in the key output (the location and magnitude of the correlation peak) is attributable to each parameter and to interactions. Without such an analysis, it is hard to know whether the emergence of a ~30‑year optimum is robust or depends delicately on a particular combination of lifespan, recruitment, loss rate, and climate variance, beyond all the remaining structural assumptions. I would strongly recommend either performing a basic global sensitivity analysis or, at minimum, substantially expanding the current sensitivity study and clearly describing how parameters are sampled and how their influence on the outputs is quantified.
>
> ---
> **中文翻译：** ABM 的人口学假设也需要更谨慎地处理。模型每年引入固定数量的新主体，并在主体达到最大年龄时将其移除；出生与死亡均不依赖当前人口规模。这会在最小与最大年龄之间产生一个平坦的年龄分布。由于每个主体的记忆窗口（从而其基线长度）依赖年龄，最终得到的集体记忆会被这种人为年龄结构强烈塑造，而这并不符合真实的历史人口结构。作者将实证中的 20–40 年滑动窗口联系到"古代中国人类的代际寿命预期"，但默认模型的最大年龄设为 40 岁（SI 中）或 60 岁（正文方法中），且招募过程并未与任何经验人口数据相连。作者报告了一个基于 ANOVA 的参数敏感性分析，但只覆盖有限参数集且未报告效应量；这并不是通常意义上的全局敏感性分析：没有 Sobol 或 Morris 类型的分解来量化关键输出（相关峰的位置与幅度）方差中有多少可归因于各参数及其交互作用。缺少此类分析，就难以判断约 30 年最优值的出现是否稳健，还是在寿命、招募、损失率与气候方差等特定组合上（以及其他结构性假设之上）非常脆弱。我强烈建议要么进行一个基础的全局敏感性分析，要么至少显著扩展当前敏感性研究，并清晰描述参数如何采样以及其对输出影响如何被量化。

**Response:** We replaced the ANOVA with a full two-stage global sensitivity analysis (SALib: Morris screening followed by a Sobol variance decomposition with bootstrap confidence intervals), run independently for the personal and collective memory baselines over five parameters (`max_age`, `new_agents`, `loss_rate`, `climate_sigma`, `climate_phi`). For the **personal** baseline — the regime matching our empirical findings — the lifespan parameter `max_age` explains ~94% of the variance in the peak-window location (first-order S1 ≈ 0.94, total ST ≈ 1.00, i.e. essentially no interaction effects), while `new_agents`, `loss_rate`, `climate_sigma` and `climate_phi` **together** contribute < 6% (every individual ST < 0.06). This directly refutes the concern that the ~30-year optimum is a delicate parameter combination: within the tested space it is, to first order, a lifespan-only effect. (Peak *strength* depends more broadly on demographics and climate persistence, but peak *window length* does not.) We have also harmonised the default `max_age` between the main text and SI.

%% 我们用一套完整的两阶段全局敏感性分析取代了原 ANOVA（基于 SALib：先做 Morris 筛选，再做带自举置信区间的 Sobol 方差分解），对 `personal` 与 `collective` 两种记忆基线分别独立运行，共变化五个参数（`max_age`、`new_agents`、`loss_rate`、`climate_sigma`、`climate_phi`）。对于与实证结果相符的 **personal**（个体记忆）机制，寿命参数 `max_age` 解释了峰值窗口位置约 94% 的方差（一阶 S1 ≈ 0.94，总效应 ST ≈ 1.00，即基本没有交互效应），而 `new_agents`、`loss_rate`、`climate_sigma`、`climate_phi` **合计**贡献 < 6%（各自的 ST 均 < 0.06）。这正面否定了"约 30 年最优值是某种脆弱参数组合"的担心：在所测范围内，它在一阶上完全由寿命决定。（峰值"强度"确实更广泛地依赖人口结构与气候持续性，但峰值"窗口长度"不然。）我们也已将正文与 SI 中的默认 `max_age` 统一。 %%

> [!quote] Reviewer #2
> More generally, the connection between the ABM and the data feels ad hoc. From the SI it is clear that the model is conceptually grounded in cognitive psychology—negativity bias and anchoring, and in SBS, but in the main text the modelling section is framed almost exclusively in terms of SBS, without stating which psychological mechanisms are actually encoded. There is no attempt to calibrate the model to the empirical WDI series, nor any formal model‑data comparison beyond the qualitative observation that both exhibit an optimal window of ~30 years, which is arguable given the log scale. Alternative mechanisms that could also generate a similar sliding‑window optimum (e.g. purely statistical effects of autocorrelation or of the rolling standardisation itself or the average age of agents) are not explored. As a result, the current ABM functions more as an non-convincing toy model than as a genuine explanatory or testing framework; the link to the empirical pattern needs to be made more rigorous.
>
> ---
> **中文翻译：** 更一般地说，ABM 与数据之间的联系显得较为"拼接式"（ad hoc）。从补充信息可看出模型在概念上扎根于认知心理学（负性偏差与锚定效应）以及 SBS，但正文的建模部分几乎只以 SBS 来框定，却未说明究竟编码了哪些心理机制。文中没有尝试将模型标定（calibrate）到实证 WDI 序列，也没有进行正式的模型—数据比较；除了定性地指出二者都呈现约 30 年的最优窗口（在对数尺度下这一点也未必站得住脚）。可能同样产生类似滑动窗口最优值的替代机制（例如自相关的纯统计效应、滚动标准化本身的效应、或主体平均年龄带来的效应）也未被探索。结果是：当前 ABM 更像一个缺乏说服力的玩具模型，而不是一个真正的解释或检验框架；与实证模式之间的联系需要更严格地建立。

**Response:** Thank you to the reviewers for raising these concerns; we fully agree with your doubts about the value of the ABM in previous versions. As you pointed out, we previously linked SBS to other cognitive psychology theories (e.g., negativity bias and anchoring), which stemmed from existing literature offering many cognition-rooted alternative explanations for the emergence of the SBS phenomenon (citations). After reorganizing the research questions following your suggestion, we refocused the research on SBS and reframed the ABM as a test of two competing hypotheses that could produce SBS. We also added a more comprehensive sensitivity analysis of the model to strengthen its explanatory power. Specific revisions include:

1. Using the memory baseline as the lever for hypothesis testing. Under the exact same model, adopting a personal versus a collective memory baseline yields qualitatively different features: only the personal baseline produces the “correlated rise-then-fall” inverse-U pattern, while the collective baseline does not. The two mechanisms produce non-overlapping peak-window distributions (personal roughly 14–30 years vs. collective roughly 60–85 years), and only the personal mechanism matches the empirical optimum of about 30 years.
2. The discussion showing two SBS-related conjectures does not conflict with deeper cognitive-psychological explanations, because they operate at different explanatory levels. For example, "negative bias" and "anchoring effects" operate at the individual level and explain why we form different baselines. And in cases where such baseline shifts occur, we show that SBS tends toward generational amnesia at the collective level, rather than collective memory illusion.
3. Confirming via sensitivity analysis that intergenerational forgetting dominates. Sobol analysis shows that under the personal experience baseline, age... Under the collective baseline, the window is almost entirely driven by climate_phi (ST ≈ 0.90) — i.e., it is merely tracking the autocorrelation structure of the climate itself, as the reviewer mentioned, a purely statistical mechanism. Because that mechanism produces a 60–85 year window, the autocorrelation mechanism cannot explain the empirical ~30-year optimum; the individual-memory mechanism limited by lifespan can.

Accordingly, we position the ABM as a mechanism-discrimination test (i.e., which memory architecture is consistent with the data), not a calibrated predictor, and we explicitly state that we did not fit the model to the WDI series.

%% 感谢审稿人提出的质疑，我们完全同意您对之前版本中 ABM 价值的疑虑。正如您指出的，我们以前把 SBS 与其它认知心理学理论联系起来（如负性偏差与锚定效应），这源于现有文献对 SBS 现象的产生也有诸多植根于认知心理学的差异化解释（引用文献）。在我们根据您的建议重新梳理研究问题之后，我们将研究问题更聚焦在 SBS 上，并将 ABM 定位为对导致 SBS 的两个竞争性假说的检验。我们也补充了对该模型更全面的敏感性分析，从而增强模型的解释力。具体修改包括：

1. **将记忆基线作为假说检验的抓手。** 在完全相同的模型下，分别采用 *个体（personal）* 与 *集体（collective）* 记忆基线，会得到性质不同的特征：只有个体基线才产生"相关先升后降"的倒 U 型格局，集体基线则没有。两种机制给出互不重叠的峰值窗口分布（个体约 14–30 年 vs 集体约 60–85 年），且只有个体机制与实证约 30 年的最优值相符。
2. 对 SBS 的两个相关猜想的讨论与更深层的认知心理解释并不冲突，因为两者属于不同层级的解释。正如讨论里提到的负向偏差和锚定效应都是个人层面的，它解释了为什么我们会产生不同的基线。而我们在这种基线转移会发生的情况下，证明了 SBS 在集体层级上倾向于代际失忆，而非集体回忆错觉
3. **通过敏感性分析证实代际失忆机制占主导。** Sobol 分析表明，个体经验基线下，年龄。集体基线的窗口几乎完全由 `climate_phi` 驱动（ST ≈ 0.90）——即它仅仅在追踪气候自身的自相关结构，正如审稿人提到的，这是一个纯统计机制。由于该机制产生的是 60–85 年窗口，自相关机制*无法*解释实证约 30 年的最优值；而受寿命限制的个体记忆机制可以。

据此，我们把 ABM 定位为一个机制甄别检验（即哪种记忆架构与数据一致），而非一个标定后的预测器，并明确说明我们没有把模型拟合到 WDI 序列上。 %%

> [!quote] Reviewer #2
> The figures require substantial revision for clarity and scientific precision. Figure 1 combines three conceptually distinct elements (a study‑area map, a conceptual SBS diagram, and a data‑processing schematic—into a single figure). For readability it would be preferable to separate these or at least more clearly delineate them. In Figure 2a, the validation period (1901–2000 CE) appears to have larger fluctuations in the integrated proxy WDI than earlier periods; this noticeable change is not explained. The caption's phrase "the grey area indicates the uncertainties" is vague; the authors should specify whether this represents, for example, the 5–95% posterior credible interval or whatever else. Panel 2c includes a colour label that is not clearly identified in the caption (I assume it's the title of the plot). Panel 2d asserts that both WDI series "follow a normal distribution", but no normality test is reported; unless a formal test is performed and described, this should be phrased differently. Figure 3's legend seems unnecessary, panels c–f are not clearly labelled in the figure, the "validation period" shows up in panel f but I don't think it even belongs ther, and again the "Monte Carlo approach" is mentioned without any explanation. In Figure 4, plotting legends on top of error bars makes the legend hard to see. Figure 5's correlation‑versus‑window‑size curves for the ABM are not interpretable without reading SI S3; the main text should explain how many runs were averaged, how events were discretized into levels, and how the curves relate to the observational analysis. At present, one effectively needs the SI to make sense of any of the modelling results, which is too heavy a dependence.
>
> ---
> **中文翻译：** 图件在清晰度与科学严谨性方面需要大幅修订。图 1 将三个概念上不同的元素（研究区地图、SBS 概念示意图、数据处理流程示意）合并在一张图里。为便于阅读，最好将其拆分，或至少更清楚地分隔。图 2a 中，验证期（1901–2000 年）的整合代用指标 WDI 波动似乎比更早时期更大；这一明显变化未作解释。图注中的"灰色区域表示不确定性"过于含糊；作者应说明该区域具体代表什么（例如 5–95% 的后验可信区间等）。2c 面板包含一个颜色标签，但图注未清晰识别（我猜它是图题）。2d 面板断言两个 WDI 序列"服从正态分布"，但并未报告任何正态性检验；除非进行了正式检验并加以描述，否则应换一种表述方式。图 3 的图例似乎不必要，c–f 面板在图中标注不清，"验证期"出现在 f 面板中但我认为它甚至不该出现；而且"蒙特卡洛方法"再次被提及却没有任何解释。图 4 中把图例画在误差条上方会使图例难以辨认。图 5 中 ABM 的"相关—窗口大小"曲线如果不阅读 SI S3 基本无法解读；正文应说明平均了多少次运行、事件如何离散成等级、以及这些曲线如何对应观测分析。目前读者几乎必须依赖补充信息才能理解建模结果，这种依赖过重。

**Response:** Thanks to the reviewers for their suggestions. We have reorganized the figures, including:

- We separated out the figure of study area into SI.
- We integrated the schematic of the SBS concept and the research-methods diagram into Figure 1, and also incorporated the multi-agent model design schematic, increasing the integration between material analysis and ABM.

%%
感谢审稿人给出的建议，我们已经对图片进行了重新组织，包括：

- 我们单独分离出来了研究区示意图，结合了其它子图对研究区做了更好的描述（子图 b 展示了该地区的历史材料历时性，子图 c 证明了上下游之间的联系
- 我们将 SBS 的概念示意图、研究方法图整合到了图 2，并把多主体模型的设计示意图也囊括了进来，增加了材料分析与 ABM 的结合程度。
- 图 3 与图至 5 的（原来的图 2 至图 4）标注信息也进行了修改。
 %%

## Minor comments

> [!quote] Reviewer #2
> In compare.py the correlation defaults likely underconstrain rolling windows, since `min(log2(n),2)` is almost always `<=2`.
>
> ---
> **中文翻译：** 在 `compare.py` 中，相关计算的默认设置可能对滚动窗口约束不足，因为 `min(log2(n),2)` 几乎总是 ≤ 2。

**Response:** Correct — the comment intended a `log2(n)` floor but the operator was `min`, pinning the default `min_periods` at 2. We fixed it to `max(int(np.log2(n)), 2)` and added regression tests. The effect on the manuscript is limited and in the correct direction: Figure 4c's main result (the ~30-year optimum; mean best-window = 38.65 yr) is **unchanged**, while a few late time-slices whose benchmark correlation was computed over too few effectively-independent observations now correctly return NaN instead of a spurious value. The relevant notebook aggregation was updated to `np.nanmean` accordingly.

%% 确实如此——注释本意是以 `log2(n)` 作为下限，但运算符写成了 `min`，使默认 `min_periods` 被固定为 2。我们已将其修正为 `max(int(np.log2(n)), 2)` 并补充了回归测试。对正文的影响有限且方向正确：图 4c 的主要结果（约 30 年最优值；平均最优窗口 = 38.65 年）**保持不变**，而少数后期时间片（其基准相关本是在过少的有效独立观测上计算得出）现在会正确返回 NaN，而非一个虚假数值。相应地，笔记本中的聚合已更新为 `np.nanmean`。 %%

> [!quote] Reviewer #2
> It seems like the confusion matrix orientation is not consistent, since you transpose, then the index and column names seem flipped, but I may have missed something here.
>
> ---
> **中文翻译：** 混淆矩阵（confusion matrix）的方向似乎不一致：你进行了转置（transpose）之后，索引与列名看起来像是互换了，但也可能是我漏看了某些细节。

**Response:** The reviewer is right about the labels. The transpose is deliberate (so the matrix matches the downstream plotting and mismatch-analysis access pattern, rows = predicted/archival, columns = true/natural), but the `index.name`/`columns.name` metadata had been set the wrong way round. We corrected the axis names to `pred`/`true` (in both `_compute_confusion_matrix` and the `false_count_matrix` property) and added a docstring explaining the transpose. The matrix **values** are identical; only the (previously mislabelled) axis-name metadata changed.

%% 关于标签，审稿人是对的。转置是有意为之的（使矩阵与下游绘图及不匹配分析的取值方式一致：行 = 预测/档案，列 = 真实/自然），但 `index.name`/`columns.name` 元数据此前设反了。我们已将轴名更正为 `pred`/`true`（同时修改 `_compute_confusion_matrix` 与 `false_count_matrix` 属性），并补充了说明转置原因的文档字符串。矩阵的**数值**逐字节一致，因此无需重绘任何图件，仅改动了此前标注有误的轴名元数据。 %%

> [!quote] Reviewer #2
> The reindexing of the matrix in calibration.py is happening at the level of the local variable (matrix) not applied to the matrix. So, in the end nothing is happening. Unless you are using a different version when this behavior is not the same. (Remarks on code availability)
>
> ---
> **中文翻译：** 在 `calibration.py` 中对矩阵进行 reindex 的操作似乎只发生在局部变量（matrix）层面，而没有真正应用回矩阵本身，因此最终等于没有生效。除非你在使用另一版本代码，使得这一行为有所不同。（关于代码可用性的说明）

**Response:** Correct — reassigning the loop variable did not rebind the underlying DataFrames, so the reindex was dead code. We fixed it to rebind both matrices explicitly and added a regression test. The dormant bug had no numerical effect because pandas' label-aligned arithmetic in the subsequent z-score step already padded to the full category axes; we verified on the manuscript's actual fixture that the resulting p-value matrix is byte-identical before and after the fix, so Figure 3 and every quoted Kendall-τ / p-value are unaffected.

%% 确实如此——对循环变量重新赋值并未重绑底层 DataFrame，因此该 reindex 属于无效代码。我们已将其修正为显式重绑两个矩阵，并补充了回归测试。这一潜伏缺陷没有数值影响，因为后续 z-score 步骤中 pandas 的标签对齐运算已将其补齐到完整的类别轴；我们在稿件实际使用的数据上验证：修复前后得到的 p 值矩阵逐字节一致，因此图 3 及所引用的所有 Kendall-τ / p 值均不受影响。 %%

> [!quote] Reviewer #2
> I skimmed the code briefly and there seems to be at least one key problem. See report. (Remarks on code availability)
>
> ---
> **中文翻译：**（关于代码可用性的说明）我粗略浏览了代码，似乎至少存在一个关键问题。详见报告。

**Response:** We thank the reviewer for the code-level scrutiny. The key problem flagged in the report is the ABM z-score operator-precedence bug, which we have fixed (see the dedicated response above); we have additionally resolved every other code issue raised — the `compare.py` `min_periods` floor, the confusion-matrix axis labels, and the `calibration.py` reindex no-op — each with a regression test and a short fix note under `docs/reviews/`. None of the corrections changes the manuscript's conclusions.

%% 感谢审稿人对代码的细致检查。报告中指出的关键问题即 ABM 的 z-score 运算优先级缺陷，我们已修复（见上文专门回应）；此外我们也逐一解决了其余代码问题——`compare.py` 的 `min_periods` 下限、混淆矩阵轴标签、以及 `calibration.py` 的 reindex 无效代码——每项均配有回归测试，并在 `docs/reviews/` 下附有简要修复说明。所有修正都不改变稿件结论。 %%
